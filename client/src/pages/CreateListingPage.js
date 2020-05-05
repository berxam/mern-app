import React, { Component } from 'react'
import { Helmet } from 'react-helmet'


import CreateListingForm from '../components/CreateListingForm'

export default class extends Component {
  render () { 
    return (
      <main className="d12">
        <Helmet>
          <title>Create listing</title>
        </Helmet>

        <h1>Create listing</h1>
          <CreateListingForm />
      </main>
    )
  }
}
