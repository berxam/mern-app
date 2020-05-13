import React, { Component } from 'react'
import { Helmet } from 'react-helmet'


import CreateListingForm from '../components/CreateListingForm'

export default class extends Component {
  render () { 
    return (
      <main className="row">
        <Helmet>
          <title>Luo listaus</title>
        </Helmet>

        <div className="d12">
          <h1>Luo listaus</h1>
          <CreateListingForm />
        </div>
      </main>
    )
  }
}
