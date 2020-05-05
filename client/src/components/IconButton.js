import React from 'react'
import { Link } from 'react-router-dom'

import '../styles/iconButtons.scss'

export default ({ to, icon, label, title, ...rest }) => {
  if (to) {
    return (
      <Link
        to={to}
        className="nav-btn"
        title={title || label}
      >
        <i className={"icon-" + icon}></i>
        <span>{label}</span>
      </Link>
    )
  }
  else {
    return (
      <button
        className="nav-btn"
        title={title || label}
        {...rest}
      >
        <i className={"icon-" + icon}></i>
        <span>{label}</span>
      </button>
    )
  }
}
