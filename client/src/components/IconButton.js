import React from 'react'
import { Link } from 'react-router-dom'

import '../styles/iconButtons.scss'

export default ({ to, icon, label, title, className, ...rest }) => {
  if (to) {
    return (
      <Link
        to={to}
        className={"nav-btn " + (className || '')}
        title={title || label}
        {...rest}
      >
        <i className={"icon-" + icon}></i>
        <span>{label}</span>
      </Link>
    )
  }
  else {
    return (
      <button
        className={"nav-btn " + (className || '')}
        title={title || label}
        {...rest}
      >
        <i className={"icon-" + icon}></i>
        <span>{label}</span>
      </button>
    )
  }
}
