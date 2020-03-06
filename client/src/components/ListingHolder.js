import React, { Component } from 'react'
import ListingPreview from './ListingPreview'
import '../styles/ListingHolder.scss'

export default class extends Component {
  constructor (props) {
    super(props)
    this.state = {
      listingsEndpoint: 'http://localhost:5000/listings?limit=8&page=0',
      listings: []
    }
  }

  componentDidMount () {
    this.loadListings()
  }

  loadListings = async () => {
    if (this.state.listingsEndpoint) {
      const response = await fetch(this.state.listingsEndpoint)
      const { data, next } = await response.json()
  
      this.setState(state => ({
          listings: [...state.listings, ...data],
          listingsEndpoint: next
      }))
    } else {
        // indicate to user that there are no more listings to load
    }
  }

  render () {
    return (
      <>
        <section className="ListingHolder">
          {this.state.listings.map(listing => (
            <ListingPreview
              key={listing._id}
              id={listing._id}
              title={listing.title}
              desc={listing.description}
            />
          ))}
        </section>
        {this.state.listingsEndpoint ? 'Loading...' : `That's all the listings!`}
      </>
    )
  }
}
