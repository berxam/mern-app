import React, { Component } from 'react'
import Listing from './Listing'
import '../styles/ListingHolder.scss'

export default class extends Component {
  constructor (props) {
    super(props)
    this.state = {
      listings: []
    }
  }

  componentDidMount () {
    this.loadListings()
  }

  loadListings = async () => {
    const response = await fetch('http://localhost:5000/listings')
    const listings = await response.json()
  
    this.setState({ listings })
  }

  render () {
    return (
      <section className="ListingHolder">
        {this.state.listings.map(listing => (
          <Listing
            key={listing._id}
            id={listing._id}
            title={listing.title}
            desc={listing.description}
          />
        ))}
      </section>
    )
  }
}
