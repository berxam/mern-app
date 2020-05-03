import React from 'react'

export default ({ id, label, type, name, ...rest }) => (
  <div className="input-float-label">
    <input
      id={id}
      name={name || id}
      placeholder={label}
      type={type || "text"}
      {...rest} />
    <label htmlFor={id}>{label}</label>
  </div>
)
