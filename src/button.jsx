/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/button-has-type */
import React from 'react'
import PropTypes from 'prop-types'
import styles from './style.module.css'

export function Button(props) {
  const { children } = props
  return <button className={styles.button}>{children}</button>
}

Button.propTypes = {
  children: PropTypes.node,
}

Button.defaultProps = {
  children: null,
}
