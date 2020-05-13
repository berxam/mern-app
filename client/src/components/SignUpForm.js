import React, { Component } from 'react'

import Form from './Form'
import TextInput from './TextInput'
import Loader from './Loader'
import createUrl from '../helpers/createUrl'

export default class extends Component {
  constructor (props) {
    super(props)
    this.state = {
      responseMsg: '',
      submitting: false
    }
  }

  onSuccess = (res) => {
    this.setState({
      submitting: false,
      responseMsg: 'Rekisteröity! Vahvista sähköpostisi.'
    })
  }

  onError = async (err) => {
    if (err instanceof Response) {
      const body = await err.json()

      this.setState({
        submitting: false,
        responseMsg: body.errors.join(' ')
      })
    } else {
      this.setState({
        submitting: false,
        responseMsg: 'Jotain meni pieleen...'
      })
    }
  }

  render () {
    return (
      <>
        <h2>Sign up</h2>
        <Form
          url={createUrl('/users')}
          method="POST"
          setLoader={() => this.setState({ submitting: true })}
          onSuccess={this.onSuccess}
          onError={this.onError}
        >
          <TextInput
            label="Sähköposti" id="signup_email" name="email" type="email" required
          />
          <TextInput
            label="Käyttäjänimi" id="signup_username" name="username" required
          />
          <TextInput
            label="Salasana" id="signup_password" name="password" type="password" required
          />

          {this.state.submitting
            ? <Loader />
            : <button type="submit" className="btn-primary">
                Sign up
              </button>
          }
        </Form>
        {this.state.responseMsg && <p>{this.state.responseMsg}</p>}
      </>
    )
  }
}
