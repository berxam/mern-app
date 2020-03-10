import React from 'react'
import '../styles/loader.scss'

export default (props) => {
  if ('setRef' in props) {
    return <div ref={props.setRef} className="loader">Loading...</div>
  } else {
    return <div className="loader">Loading...</div>
  }
}
