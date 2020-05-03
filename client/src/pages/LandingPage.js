import React from 'react'
import { Helmet } from 'react-helmet'

import ListingHolder from '../components/ListingHolder'

export default () => {
  return (
    <>
      <Helmet>
        <title>Vaihtokauppa.com</title>
        <meta name="description" content={
          'Vaihdantataloudella toimiva verkkokauppa.'
        } />
      </Helmet>

      <main className="d12 m6">
        <h1>Raha on niin viime vuosituhatta</h1>
        <p>Vaihda hetki aikaasi tavaraksi, tai vaikka vanhoja vaatteitasi nurmikonleikkuusta.</p>
        <button className="btn-primary">Liity käyttäjäksi</button>
        <button className="btn">Selaa ilmoituksia</button>
      </main>
      <div className="d12">
        <ListingHolder />
      </div>
    </>
  )
}
