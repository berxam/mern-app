import React from 'react'
import { Helmet } from 'react-helmet'

import ListingHolder from '../components/ListingHolder'
import '../styles/LandingPage.scss'

export default () => {
  return (
    <>
      <Helmet>
        <title>Vaihtokauppa.com</title>
        <meta name="description" content={
          'Vaihdantataloudella toimiva verkkokauppa.'
        } />
      </Helmet>

      <main className="landing d12 m7">
        <h1>Raha on niin viime vuosituhatta</h1>
        <p>Vaihda hetki aikaasi tavaraksi, tai vaikka vanhoja vaatteitasi nurmikonleikkuusta.</p>
        <div>
          <button className="btn-primary">Liity käyttäjäksi</button>
          <button className="btn">Selaa ilmoituksia</button>
        </div>
      </main>
      <div className="d12">
        <h2>Viimeisimmät listaukset</h2>
        <ListingHolder />
      </div>
    </>
  )
}
