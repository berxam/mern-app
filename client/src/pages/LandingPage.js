import React, { useState } from 'react'
import { Helmet } from 'react-helmet'

import TextInput from '../components/TextInput'
import ListingHolder from '../components/ListingHolder'
import ListingPreview from '../components/ListingPreview'
import '../styles/LandingPage.scss'
import ShoppingImage from '../assets/shopping.svg'

export default () => {
  const [searchOptions, setSearchOptions] = useState({})

  const updateSearchOptions = event => {
    const searchString = event.target.value
    setSearchOptions({ searchString })
  }

  return (
    <>
      <Helmet>
        <title>Swapza</title>
        <meta name="description" content={
          'Vaihdantataloudella toimiva verkkokauppa.'
        } />
      </Helmet>

      <main className="landing d12 m6">
        <h1>Raha on niin viime vuosituhatta</h1>
        <p>Vaihda hetki aikaasi tavaraksi, tai vaikka vanhoja vaatteitasi nurmikonleikkuusta.</p>
        <div>
          <TextInput label="Hae tuotteita tai palveluita" onChange={updateSearchOptions} />
        </div>
      </main>
      <div className="landing-image m6">
        <img src={ShoppingImage} alt="Illustraatio verkkokaupasta" />
      </div>
      <div className="d12">
        <h2>Selaa ja hae listauksia</h2>
        <ListingHolder options={searchOptions}>
          {({ _id, ...rest }) => (
            <ListingPreview key={_id} id={_id} {...rest} />
          )}
        </ListingHolder>
      </div>
    </>
  )
}
