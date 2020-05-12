import React, { Component } from 'react'
import { Helmet } from 'react-helmet'

import Loader from '../components/Loader'
import ListingHolder from '../components/ListingHolder'
import ListingPreview from '../components/ListingPreview'
import EditForm from '../components/EditForm'
import Modal from '../components/Modal'

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

    return (
      <main>
        {username && rating ? (
          <>
            <Helmet>
              <title>{username}</title>
            </Helmet>

            <h1>{username}</h1>
            <p>loca : {location}</p>
            <Modal
              setOpener={open => this.openEditModal = open}
              setCloser={hide => this.hideEditModal = hide}>
              <EditForm id={this.props.match.params.id} hideModal={this.hideEditModal} />
            </Modal>
            <button className="btn-primary" 
              onClick={() => this.openEditModal()}>
              Muokkaa tietoja
            </button>
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
