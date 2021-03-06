import React from 'react'
import { Link } from 'react-router-dom'
import Image from './Image'
import Placeholder from '../assets/placeholder.png'

const maxDescLen = 72

export default ({ title, description, id, images }) => (
  <article className="listingPreview">
    {images.length ? <Image src={images[0]} alt={title} /> : <Image src={Placeholder} alt={title} />}

    <h1>{title}</h1>
    <p>{description.length > maxDescLen ?
      description.substring(0, maxDescLen) + '...'
      : description}
    </p>
    <Link to={`/listings/${id}`} className="btn-primary">
      Lue lisää
    </Link>
  </article>
)
