import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import createUrl from '../helpers/createUrl'
import '../styles/Offers.scss'

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
      <li className="offer">
        <span>
          <Link to={`/users/${creatorId}`}>
            {username || 'Loading'}
          </Link> tarjosi <Link to={`/listings/${creatorListingId}`}>
            {listingName || 'loadingin...'}
          </Link>
        </span>

        <div>
          <button
            onClick={() => this.setAccept(true)}
            className="btn-primary"
          >Hyväksy</button>
          <button
            onClick={() => this.setAccept(false)}
            className="btn"
          >Hylkää</button>
        </div>
      </li>
    )
  }
}

export default (props) => (
  <ul>
    {props.offers.map((offer) => <Offer key={offer._id} {...offer} />)}
  </ul>
)
