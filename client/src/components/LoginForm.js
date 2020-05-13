import React, { Component } from 'react'

import Form from './Form'
import TextInput from './TextInput'
import Loader from './Loader'

import { AuthContext } from './AuthContext'
import createUrl from '../helpers/createUrl'

export default class extends Component {
  static contextType = AuthContext

  constructor (props) {
    super(props)
    this.state = {
      responseMsg: '',
      submitting: false
    }
  }

  submit = async (event) => {
    event.preventDefault()
    this.setState({ submitting: true })
    let formData = {}
    new FormData(event.target)
      .forEach((value, key) => formData[key] = value)

    const status = await this.context.login(formData)
    let responseMsg = ''

    switch (status) {
      case 404:
        responseMsg = 'Käyttäjää ei löytynyt.'
        break
      case 401:
        responseMsg = 'Salasana on väärä.'
        break
      case 403:
        responseMsg = 'Sähköpostia ei ole vahvistettu!'
        break
      case true:
        responseMsg = 'Kirjautuminen onnistui!'
        break
      default:
        responseMsg = 'Jotain meni pieleen...'
    }

    this.setState({ submitting: false, responseMsg })
  }

  resetPassword = async () => {
    const email = document.getElementById('login_email').value
    const url = createUrl('/users/reset-password')

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })

      if (response.ok) {
        this.setState({ responseMsg: 'Salasana resetoitu, katso sähköpostisi.' })
      } else {
        this.setState({ responseMsg: 'Ei onnistunut resetoimaan. Varmista, että sähköpostisi on oikein kirjoitettu.' })
      }
    } catch (error) {
      this.setState({ responseMsg: error.message })
    }
  }

  render () {
    return (
      <>
        <h2>Kirjaudu sisään</h2>
        <Form onSubmit={this.submit}>
          <TextInput
            label="Sähköposti"
            id="login_email"
            name="email"
            type="email"
            required
          />
          <TextInput
            label="Salasana"
            id="login_password"
            name="password"
            type="password"
            required
          />

          {this.state.submitting
            ? <Loader />
            : <div>
                <button type="submit" className="btn-primary">
                  Kirjaudu sisään
                </button>
                <button className="btn" onClick={this.resetPassword}>
                  Unohdin salasanani
                </button>
              </div>
          }
        </Form>
        
        {this.state.responseMsg && <p>{this.state.responseMsg}</p>}
      </>
    )
  }
}
