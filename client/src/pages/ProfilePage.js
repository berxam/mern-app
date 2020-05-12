import React, { Component } from 'react'
import { Helmet } from 'react-helmet'

import Loader from '../components/Loader'
import ListingHolder from '../components/ListingHolder'
import ListingPreview from '../components/ListingPreview'
import EditForm from '../components/EditForm'
import Modal from '../components/Modal'
import getUser from '../helpers/getUser'

export default class extends Component {
  constructor (props) {
    super(props)
    this.state = {
      user: {}
    }
  }

  componentDidMount () {
    this.loadUser()
  }

  loadUser = async () => {
    try {
      const response = await fetch(`http://localhost:5000/users/${
        this.props.match.params.id
      }`)
      const user = await response.json()
  
      this.setState({ user })
    } catch (error) {
      console.error('[userPage:loaduser]', error)
    }
  }

  render () {
    const { username, rating, location, description } = this.state.user
    let button
    if (getUser() && this.props.match.params.id === getUser().id) {
      button = <button className="btn-primary" onClick={() => this.openEditModal()}> Muokkaa tietoja </button>
      }

    return (
      <main>
        {username && rating ? (
          <>
            <Helmet>
              <title>{username}</title>
            </Helmet>
            <div className="row">
              <section className="d12 m8">
                <h1>{username}</h1>
                <p>Sijainti: {location}</p>
                <p>{description}</p>
                <Modal setOpener={open => this.openEditModal = open}>
                  <EditForm id={this.props.match.params.id} />
                </Modal>
              </section>
            </div>
            {button}
            <div className="row">
              <h2>Listaukset</h2>
            </div>
            <div className="row">
              <section className="d12 m8">
                <ListingHolder options={{creatorId: this.props.match.params.id}}>
                  {({ _id, ...rest }) => (
                    <ListingPreview key={_id} id={_id} {...rest} />
                  )}
                </ListingHolder>
              </section>
            </div>
          </>
        ) : <Loader />}
      </main>
    )
  }
}
