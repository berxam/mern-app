import React, { Component } from 'react'
import Listing from './Listing'

class ListingView extends Component {
  constructor (props) {
    super(props)
    this.endpoint = 'http://localhost:5000/listings'
    this.state = { listings: [] }
    //this.setState({  })
  }
  
  async componentDidMount () {
    const response = await fetch(this.endpoint)
    const listings = await response.json()

    this.setState({ listings })
  }

  render () {
    return this.state.listings.map(listing => (
      <Listing title={listing.title} desc={listing.description} />
    ))
  }
}

export default ListingView
