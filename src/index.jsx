function getGlobal() {
  if (typeof window !== 'undefined') {
    return window
  }
  if (typeof global !== 'undefined') {
    return global
  }
  throw new Error('unable to locate global object')
}
// Ensure that it works both in browser and in nodejs
const globalHandle = {}
if (getGlobal().document) globalHandle.document = getGlobal().document
else globalHandle.document = { cookie: '' }

if (getGlobal().localStorage) globalHandle.localStorage = getGlobal().localStorage

const KEY = 'bsonMachineId'

/**
 * Simple class that mimics MongoDB.Bson.ObjectId and converts to standard 24 character representation.
 */
class BsonId {
  static initialize() {
    if (BsonId.machine) {
      return
    }

    let machine = Math.floor(Math.random() * 16777216)

    function setInCookies() {
      const cookieList = globalHandle.document.cookie.split('; ')
      // eslint-disable-next-line no-restricted-syntax, guard-for-in
      for (const i in cookieList) {
        const cookie = cookieList[i].split('=')
        const cookieMachineId = parseInt(cookie[1], 10)
        if (
          cookie[0] === KEY &&
          cookieMachineId &&
          cookieMachineId >= 0 &&
          cookieMachineId <= 16777215
        ) {
          machine = cookieMachineId
          break
        }
      }
      globalHandle.document.cookie = `${KEY}=${machine};expires=Tue, 01 Jan 2500 05:00:00 GMT;path=/`
    }

    function setInLocalStorage() {
      try {
        const existing = globalHandle.localStorage[KEY]
        if (existing) {
          const machineId = parseInt(existing, 10)
          if (machineId >= 0 && machineId <= 16777215) {
            machine = Math.floor(existing)
          }
        }
        globalHandle.localStorage[KEY] = machine
      } catch (e) {
        setInCookies()
      }
    }

    if (typeof globalHandle.localStorage !== 'undefined') {
      setInLocalStorage()
    } else {
      setInCookies()
    }
    BsonId.machine = machine
    BsonId.pid = Math.floor(Math.random() * 65536)
    BsonId.increment = Math.floor(Math.random() * 16777216)
  }

  static generateId() {
    BsonId.initialize()
    if (
      BsonId.machine === undefined ||
      BsonId.pid === undefined ||
      BsonId.increment === undefined
    ) {
      throw new Error('Could not generate BsonId')
    }

    const timestamp = Math.floor(new Date().valueOf() / 1000).toString(16)
    const machine = BsonId.machine.toString(16)
    const pid = BsonId.pid.toString(16)
    // eslint-disable-next-line no-plusplus
    const increment = (BsonId.increment++).toString(16)
    if (BsonId.increment > 0xffffff) {
      BsonId.increment = 0
    }

    // Convert to a 24 character string representation.
    return (
      '00000000'.substr(0, 8 - timestamp.length) +
      timestamp +
      '000000'.substr(0, 6 - machine.length) +
      machine +
      '0000'.substr(0, 4 - pid.length) +
      pid +
      '000000'.substr(0, 6 - increment.length) +
      increment
    )
  }
}

function bsonId() {
  return BsonId.generateId()
}

export { bsonId }
