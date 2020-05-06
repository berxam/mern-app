import React, { useState } from 'react'
import Placeholder from '../assets/placeholder.png'

export default ({ src, alt, ...props }) => {
  const [source, setSource] = useState(src)
  const [errored, setErrored] = useState(false)

  const onError = () => {
    if (!errored) {
      setSource(Placeholder)
      setErrored(true)
    }
  }

  return (
    <img
      src={source}
      alt={alt || ''}
      onError={onError}
      {...props}
    />
  )
}
