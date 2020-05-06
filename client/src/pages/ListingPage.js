import React, { Component } from 'react'
import { Helmet } from 'react-helmet'

import Offers from '../components/Offers'
import Loader from '../components/Loader'
import OfferForm from '../components/OfferForm'
import IconButton from '../components/IconButton'
import Modal from '../components/Modal'
import Image from '../components/Image'
import { AuthContext } from '../components/AuthContext'
import createUrl from '../helpers/createUrl'

import '../styles/ListingPage.scss'

export default class extends Component {
  constructor (props) {
    super(props)
    this.state = {
      listing: {}
    }
  }

  componentDidMount () {
    this.loadListing(this.props.match.params.id)
  }

  componentWillReceiveProps (nextProps) {
    if(this.props.match.params.id !== nextProps.match.params.id) {
      this.loadListing(nextProps.match.params.id)
    }
  }

  loadListing = async (id) => {
    const url = createUrl(`/listings/${id}`)

    try {
      const response = await fetch(url)

      if (response.ok) {
        const listing = await response.json()
        this.setState({ listing })
      } else {
        this.setState({ listing: {
          title: 'Not found',
          description: 'Wrong ID in the URL...',
          images: [],
          offers: [],
          notFound: true
        }})
      }
    } catch (error) {
      console.error('[ListingPage:loadListing]', error)
    }
  }

  render () {
    const { title, description, images, offers, creatorId } = this.state.listing

    return (
      <main>
        {title && description ? (
          <>
            <Helmet>
              <title>{title}</title>
              <meta name="description" content={description} />
            </Helmet>

            <div className="row">
              <section className="d12 m8">
                {images.length ? <Image src={images[0]} alt={title} /> : null}

                <h1>{title}</h1>
                <p>{description}</p>
              </section>
              <section className="d12 m4">
                <h2>Käyttäjän tiedot</h2>
              </section>
            </div>

            <div className="row">
              {!this.state.listing.notFound && (
                <section className="d12 m8">
                  <header className="offer-container-header">
                    <h2>Tarjoukset</h2>
                    <AuthContext.Consumer>
                      {context => {
                        return context.isAuthenticated ? (
                          <>
                            <Modal setOpener={open => this.openOfferForm = open}>
                              <OfferForm listingId={this.props.match.params.id}/>
                            </Modal>
                            <IconButton
                              onClick={() => this.openOfferForm()}
                              label="Tee tarjous"
                              icon="paper-plane-1"
                            />
                          </>
                        ) : null
                      }}
                    </AuthContext.Consumer>
                  </header>
                  {offers.length ?
                    <Offers offers={offers} listingCreator={creatorId} />
                    : 'Ei tarjouksia'}
                </section>
              )}
            </div>
          </>
        ) : <Loader />}
      </main>
    )
  }
}
