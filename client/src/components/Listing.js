import React from 'react'
import '../styles/Listing.css'

export default ({ title, desc }) => (
  <article>
    <h1>{title}</h1>
    <p>{desc}</p>
  </article>
)
