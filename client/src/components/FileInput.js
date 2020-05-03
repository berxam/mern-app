import React, { useState, useRef } from 'react'

export default ({ id, label, type, name, ...rest }) => {
  const [filenames, setFilenames] = useState([])
  const input = useRef(null)

  const onChange = event => {
    const files = event.target.files
    setFilenames(Array.prototype.map.call(files, f => f.name))
  }

  return (
    <div className="file-input" onClick={() => input.current.click()}>
      <input
        ref={input}
        id={id}
        name={name || id}
        type="file"
        onChange={onChange}
        className={filenames.length ? 'hasFiles' : ''}
        {...rest}
      />
      <label htmlFor={id}>{label}</label>

      {filenames.length ? <span>{filenames.join(', ')}</span> : '' }
    </div>
  )
}
