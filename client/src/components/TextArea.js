import React from 'react'

export default ({ id, label, type, name, ...rest }) => (
  <div className="textarea-float-label">
    <textarea id={id}
      name={name || id}
      placeholder={label}
      type={type || "text"}
      maxLength="600"
      {...rest}
    ></textarea>
    <label htmlFor={id}>{label}</label>
  </div>
)
