import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import createUrl from '../helpers/createUrl'

class Offer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      username: '',
      listingName: ''
    }
  }

  async componentDidMount () {
    const { creatorId, creatorListingId } = this.props
    const userUrl = createUrl(`/users/${creatorId}`)
    const listingUrl = createUrl(`/listings/${creatorListingId}`)

    try {
      const [user, listing] = await Promise.all([
        fetch(userUrl), fetch(listingUrl)
      ])
      const jsonCalls = []
      if (user.ok) jsonCalls.push(user.json())
      if (listing.ok) jsonCalls.push(listing.json())
      const [{ username }, { title }] = await Promise.all(jsonCalls)
      this.setState({ username, listingName: title })
    } catch (error) {
      console.error(error)
    }
  }

  render () {
    const { creatorId, creatorListingId } = this.props
    const { username, listingName } = this.state

    return (
      <li>
        <Link to={`/users/${creatorId}`}>
          {username || 'Loading'}
        </Link> tarjosi <Link to={`/listings/${creatorListingId}`}>
          {listingName || 'loadingin...'}
        </Link>
      </li>
    )
  }
}

export default (props) => (
  <ul>
    {props.offers.map((offer) => <Offer key={offer._id} {...offer} />)}
  </ul>
)
