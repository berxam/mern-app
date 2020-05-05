import React, { Component } from 'react'

import Form from './Form'
import TextInput from './TextInput'
import Loader from './Loader'


import { AuthContext } from './AuthContext'
import CreateListingForm from './CreateListingForm'

export default class extends Component {
  static contextType = AuthContext

  constructor (props) {
    super(props)
  }


  render () {
    return (
      <button>
        tee tarjous
      </button>
    )
  }
}
