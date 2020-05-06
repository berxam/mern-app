import React, { Component } from 'react'
import { Helmet } from 'react-helmet'


import CreateListingForm from '../components/CreateListingForm'

export default class extends Component {
  render () { 
    return (
      <main className="row">
        <Helmet>
          <title>Create listing</title>
        </Helmet>

        <div className="d12">
          <h1>Create listing</h1>
          <CreateListingForm />
        </div>
      </main>
    )
  }
}
