import React, { Component } from 'react'
import { Helmet } from 'react-helmet'

import Loader from '../components/Loader'

export default class extends Component {
  constructor (props) {
    super(props)
    this.state = {
      listing: {}
    }
  }

  componentDidMount () {
    this.loadListing()
  }

  loadListing = async () => {
    try {
      const response = await fetch(`http://localhost:5000/listings/${
        this.props.match.params.id
      }`)
      const listing = await response.json()
  
      this.setState({ listing })
    } catch (error) {
      console.error('[ListingPage:loadListing]', error)
    }
  }

  render () {
    const { title, description, images } = this.state.listing

    return (
      <main>
        {title && description ? (
          <>
            <Helmet>
              <title>{title}</title>
              <meta name="description" content={description} />
            </Helmet>

            {images.length ? <img src={images[0]} alt={title} /> : ''}

            <h1>{title}</h1>
            <p>{description}</p>

            <h2>Tarjoukset</h2>
          </>
        ) : <Loader />}
      </main>
    )
  }
}
