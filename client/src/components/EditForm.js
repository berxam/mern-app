import React, { Component } from 'react'

import Form from './Form'

import fetchWithAuth from '../helpers/fetchWithAuth'
import createUrl from '../helpers/createUrl'
import TextInput from '../components/TextInput'
import TextArea from '../components/TextArea'


export default class extends Component {
  constructor (props) {
    super(props)
      this.state = {
        location: '',
        description: ''
      }
  }

  submit = async (event) => {
    event.preventDefault()
    const url = createUrl(`/users/${this.props.id}`)
    console.log(url)

    const settings = {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        location: this.state.location,
        description: this.state.description
      })
    }

    try {
      const response = await fetchWithAuth(url, settings)

      if (response.ok) {
        console.log('tiedot vaihdettu')
      } else {
        console.error(response)
      }
    } catch (error) {
      console.error(error)
    }
  }

  changeDescription = (event) => this.setState({description: event.target.value})

  changeLocation = (event) => this.setState({location: event.target.value})

  render () {
    return (
      <Form onSubmit={this.submit}>
        <TextInput
            label="Sijainti" id="location_id" name="location" type="text" onChange={this.changeLocation} required
        />
        <TextArea
            label="Kuvaus" id="description_id" name="description" onChange={this.changeDescription} required
        />
        <button type="submit" className="btn-primary">
          Muuta tietoja
        </button>
      </Form>
    )
  }
}
