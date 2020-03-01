import React from 'react'
import { Link } from 'react-router-dom'

export default ({ title, desc, id }) => (
  <article>
    <h1>{title}</h1>
    <p>{desc}</p>
    <Link to={`/listings/${id}`}>Lueppa lisää</Link>
  </article>
)
