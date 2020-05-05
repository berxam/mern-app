import React, { Component } from 'react'
import ListingPreview from './ListingPreview'
import Loader from './Loader'
import '../styles/ListingHolder.scss'

export default class extends Component {
  constructor (props) {
    super(props)
    this.state = {
      listingsEndpoint:
        `http://localhost:5000/listings?limit=${props.limit || 12}&page=0`,
      listings: []
    }
    this.instersectionObserver = new IntersectionObserver(
      this.intersectionHandler
    )
  }

  componentWillUnmount () {
    this.instersectionObserver.disconnect()
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
      this.instersectionObserver.disconnect()
    }
  }

  intersectionHandler = (entries) => {
    if (entries[0].isIntersecting) {
    // entries.forEach(entry => {
    //   if (entry.isIntersecting) {
    //   if (entry.intersectionRatio > 0) {
      this.loadListings()
    //})
    }
  }

  setRef = (ref) => {
    this.loaderRef = ref

    if (this.loaderRef) {
      this.instersectionObserver.observe(this.loaderRef)
    }
  }

  render () {
    return (
      <>
        <section className="ListingHolder">
          {this.state.listings.map(({ _id, ...rest }) => (
            <ListingPreview key={_id} id={_id} {...rest} />
          ))}
        </section>
        {this.state.listingsEndpoint ? <Loader setRef={this.setRef} /> : ''}
      </>
    )
  }
}
