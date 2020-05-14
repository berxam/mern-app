import React, { Component } from 'react'
import Loader from './Loader'
import createUrl from '../helpers/createUrl'
import '../styles/ListingHolder.scss'

export default class extends Component {
  constructor (props) {
    super(props)
    this.lastOptions = JSON.stringify(props.options)
    this.state = {
      listingsEndpoint: '',
      listings: []
    }
    // this.setListingEndpoint()
    this.instersectionObserver = new IntersectionObserver(this.intersectionHandler)
  }

  componentDidMount () {
    this.setListingEndpoint()
  }

  componentDidUpdate () {
    const currentOptions = JSON.stringify(this.props.options)

    if (this.lastOptions !== currentOptions) {
      console.log('Options have changed...')
      this.lastOptions = currentOptions
      this.setListingEndpoint()
    } else {
      console.log('Options have not changed.')
    }
  }

  componentWillUnmount () {
    this.instersectionObserver.disconnect()
  }

  setListingEndpoint = () => {
    const listingsEndpoint = createUrl('/listings', {
      limit: this.props.limit || 12,
      page: 0,
      ...this.props.options
    })

    console.log(`Setting initial listingsEndpoint to be ${listingsEndpoint}`)

    this.setState({
      listingsEndpoint,
      listings: []
    }, () => this.loadListings())
  }

  loadListings = async () => {
    if (this.state.listingsEndpoint) {
      try {
        const response = await fetch(this.state.listingsEndpoint)

        if (response.ok) {
          const { data, next } = await response.json()
    
          const uniqueListings = data.filter(({ _id }) => (
            this.state.listings.find(l => l._id === _id) ? false : true
          ))
    
          this.setState(state => ({
              listings: [...state.listings, ...uniqueListings],
              listingsEndpoint: next
          }))
          console.log(`Setting next listingsEndpoint to be ${next}`)
        } else {
          console.error(response)
        }
      } catch (error) {
        console.error(error)
      }
    } else {
      console.log('Load listings triggered but theres no endpoint to load from')
    }
  }

  intersectionHandler = (entries) => {
    if (entries.some(e => e.isIntersecting)) this.loadListings()
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
