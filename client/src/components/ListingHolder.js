import React, { Component } from 'react'
import Loader from './Loader'
import createUrl from '../helpers/createUrl'
import '../styles/ListingHolder.scss'

export default class extends Component {
  constructor (props) {
    super(props)
    this.state = {
      listingsEndpoint: createUrl('/listings', {
        limit: props.limit || 12,
        page: 0,
        ...props.options
      }),
      listings: []
    }
    this.instersectionObserver = new IntersectionObserver(this.intersectionHandler)
  }

  componentWillUnmount () {
    this.instersectionObserver.disconnect()
  }

  loadListings = async () => {
    if (this.state.listingsEndpoint) {
      try {
        const response = await fetch(this.state.listingsEndpoint)
        const { data, next } = await response.json()
  
        const uniqueListings = data.filter(({ _id }) => (
          this.state.listings.find(l => l._id === _id) ? false : true
        ))
  
        this.setState(state => ({
            listings: [...state.listings, ...uniqueListings],
            listingsEndpoint: next
        }))
      } catch (error) {
        console.error(error)
      }
    } else {
      this.instersectionObserver.disconnect()
    }
  }

  intersectionHandler = (entries) => {
    if (entries[0].isIntersecting) this.loadListings()
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

          {this.state.listings.map(this.props.children)}

        </section>

        {this.state.listingsEndpoint ? <Loader setRef={this.setRef} /> : ''}
      </>
    )
  }
}
