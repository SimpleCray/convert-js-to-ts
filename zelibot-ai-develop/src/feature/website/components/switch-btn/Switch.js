import React from 'react'
import { IOSSwitch } from './SwitchStyle'

const Switch = ({ size, checked, onChange }) => {
  return (
    <IOSSwitch onChange={onChange} size={size} checked={checked}></IOSSwitch>
  )
}

export default Switch