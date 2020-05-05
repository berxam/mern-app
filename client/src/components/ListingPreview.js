import React from 'react'
import { Link } from 'react-router-dom'

export default ({ title, description, id, images }) => (
  <article className="listingPreview">
    {images.length ? <img src={images[0]} alt={title} /> : ''}
    <h1>{title}</h1>
    <p>{description}</p>
    <Link to={`/listings/${id}`} className="btn-primary">
      Lue lisää
    </Link>
  </article>
)
