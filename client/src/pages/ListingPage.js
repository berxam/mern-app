import React, { Component } from 'react'
import { Helmet } from 'react-helmet'

import Offers from '../components/Offers'
import Loader from '../components/Loader'
import OfferForm from '../components/OfferForm'
import IconButton from '../components/IconButton'
import Modal from '../components/Modal'
import { AuthContext } from '../components/AuthContext'

export default class extends Component {
  constructor (props) {
    super(props)
    this.state = {
      listing: {}
    }
  }

  componentDidMount () {
    this.loadListing()
  }

  loadListing = async () => {
    try {
      const response = await fetch(`http://localhost:5000/listings/${
        this.props.match.params.id
      }`)
      const listing = await response.json()
      console.log(listing)
      this.setState({ listing })
    } catch (error) {
      console.error('[ListingPage:loadListing]', error)
    }
  }

  render () {
    const { title, description, images , offers} = this.state.listing

    return (
      <main>
        {title && description ? (
          <>
            <Helmet>
              <title>{title}</title>
              <meta name="description" content={description} />
            </Helmet>

            {images.length ? <img src={images[0]} alt={title} /> : ''}

            <h1>{title}</h1>
            <p>{description}</p>

            <AuthContext.Consumer>
              {context => {
                return context.isAuthenticated ? (
                  <>
                    <h2>Tee tarjous</h2>
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

            <h2>Tarjoukset</h2>
            {offers.length ? <Offers offers={offers} /> : 'Ei tarjouksia'}
          </>
        ) : <Loader />}
      </main>
    )
  }
}
