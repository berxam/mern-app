import React from 'react'
import { Link } from 'react-router-dom'
import Image from './Image'

export default ({ title, description, id, images }) => (
  <article className="listingPreview">
    {images.length ? <Image src={images[0]} alt={title} /> : null}

    <h1>{title}</h1>
    <p>{description}</p>
    <Link to={`/listings/${id}`} className="btn-primary">
      Lue lisää
    </Link>
  </article>
)
