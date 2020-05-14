import React, { Component } from 'react'
import { Helmet } from 'react-helmet'

import Loader from '../components/Loader'
import ListingHolder from '../components/ListingHolder'
import ListingPreview from '../components/ListingPreview'
import EditForm from '../components/EditForm'
import Modal from '../components/Modal'
import createUrl from '../helpers/createUrl'
import RatingForm from '../components/RatingForm'
import RatingsHolder from '../components/RatingsHolder'
import RatingsAverage from '../components/RatingsAverage'
import getUser from '../helpers/getUser'
import { AuthContext } from '../components/AuthContext'

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
    const url = createUrl(`/users/${this.props.match.params.id}`)

    try {
      const response = await fetch(url)
      const user = await response.json()
      this.setState({ user })
    } catch (error) {
      console.error('[userPage:loaduser]', error)
    }
  }

  render () {
    const { username, ratings, location, description } = this.state.user

    return (
      <main>
        {username ? (
          <>
            <Helmet>
              <title>{username}</title>
            </Helmet>

            <div className="row">
              <section className="d12 m8">
                <h1>{username}</h1>
                {location ? <p>Sijainti: {location}</p> : null}
                {description ? <p>{description}</p> : null}
                {ratings ? <p>Palaute: <RatingsAverage ratings={ratings} /> </p> : null}

                {getUser() && this.props.match.params.id === getUser().id ? <div><button className="btn-primary" onClick={() => this.openEditModal()}>Muokkaa tietoja</button></div> : null}
              </section>
              <section className="d12 m4">
                <AuthContext.Consumer>
                  {context => (
                    context.isAuthenticated ? (
                      <>
                        <h2>Kirjoita kommentti</h2>
                        <RatingForm id={this.props.match.params.id}/>
                        <Modal setOpener={open => this.openEditModal = open}>
                          <EditForm id={this.props.match.params.id} />
                        </Modal>
                      </>
                    ) : null
                  )}
                </AuthContext.Consumer>

                <h2>Kommentit</h2>
                <RatingsHolder ratings={ratings} />
              </section>
            </div>
            
            <div className="row">
              <section className="d12 m8">
                <h2>Listaukset</h2>
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
