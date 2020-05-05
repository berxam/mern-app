import React, { Component } from 'react'

import Form from './Form'
import ListingHolder from '../components/ListingHolder'

import ListingData from './ListingData'
import fetchWithAuth from '../helpers/fetchWithAuth'

import getUser from '../helpers/getUser'

export default class extends Component {

  constructor (props) {
    super(props)
    this.state = {offer:'', creatorId:''}
  }

  submit = async (event) => {
    event.preventDefault()
    const settings = {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        creatorId: this.state.creatorId,
        creatorListingId: this.state.offer
      })
    }
    console.log(settings.body)

    try {
      const response = await fetchWithAuth('http://localhost:5000/listings/' + this.props.listingId + '/offer', settings)
      if (response.ok) {
        const list = await response.json()
      }

    } catch (error) {
      console.error(error)
    }
  

  }

  render () {
    return (
      <Form onSubmit={this.submit}>
          <ListingHolder options={{ creatorId: getUser().id }}>
          {({ _id, ...rest }) => (
            <ListingData key={_id} id={_id} {...rest} onClick={() => this.setState({offer: _id, creatorId: rest.creatorId })}/>
          )}
              
          </ListingHolder>
          <p>Valinta: {this.state.offer}</p>
          <button type="submit" className="btn-primary">
            Lähetä tarjous
          </button>
      </Form>
    )
  }
}
