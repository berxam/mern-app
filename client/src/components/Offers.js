import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'

import { AuthContext } from '../components/AuthContext'
import createUrl from '../helpers/createUrl'
import '../styles/Offers.scss'
import getUser from '../helpers/getUser'
import fetchWithAuth from '../helpers/fetchWithAuth'

class RealOffer extends Component {
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

  setAccept = async (value) => {
    const url = createUrl(`/listings/${
      this.props.location.pathname.split('/')[2]
    }/offers/${this.props._id}`)

    try {
      const res = await fetchWithAuth(url, {
        method: 'PUT',
        body: JSON.stringify({ accepted: value })
      })

      if (res.ok) {
        console.log(`Offer ${value ? 'accepted' : 'rejected'}`)
      } else {
        console.error(res)
      }
    } catch (error) {
      console.error(error)
    }
  }

  render () {
    const { creatorId, creatorListingId, listingCreator } = this.props
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

        <AuthContext.Consumer>
          {context => {
            if (!context.isAuthenticated) return null
            if (getUser().id !== listingCreator) return null

            return (
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
            )
          }}
        </AuthContext.Consumer>
      </li>
    )
  }
}

const Offer = withRouter(props => <RealOffer {...props} />)

export default (props) => (
  <ul>
    {props.offers.map((offer) => (
      <Offer key={offer._id} listingCreator={props.listingCreator} {...offer} />
    ))}
  </ul>
)
