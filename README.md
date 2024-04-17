# bsonid

An utility on browser and node to create MonogoDB friendly object id.

[ObjectIds](https://www.mongodb.com/docs/manual/reference/bson-types/#objectid) in MongoDB are small, likely unique, fast to generate, and ordered. ObjectId values are 12 bytes in length, consisting of:

- A 4-byte timestamp, representing the ObjectId's creation, measured in seconds since the Unix epoch.

- A 5-byte random value generated once per process. This random value is unique to the machine and process.

- A 3-byte incrementing counter, initialized to a random value.

### Why not use [uuid](https://www.npmjs.com/package/uuid)
Of course, you can use [uuid](https://www.npmjs.com/package/uuid). However, in the scenerio where you want to insert the object to MonogoDB; uuid would not be accepted by MongoDB. That's where, bsonId can be helpful to you.

#### Install

`yarn add bsonid`

#### Usage

```javascript
import { bsonId } from 'bsonid'

const id = bsonId()
console.log(id)

```

### Author

[Prolincur Technologies](https://prolincur.com)