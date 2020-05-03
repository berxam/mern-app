import React, { Component } from 'react'

import Form from './Form'
import TextInput from './TextInput'
import Loader from './Loader'

import { AuthContext } from './AuthContext'

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

    if (!await this.context.login(formData)) {
      this.setState({
        submitting: false,
        responseMsg: 'Something went wrong...'
      })
    } else {
      this.setState({
        submitting: false,
        responseMsg: 'Logged in!'
      })
    }
  }

  render () {
    return (
      <>
        <h2>Sign in</h2>
        <Form onSubmit={this.submit}>
          <TextInput
            label="Email"
            id="login_email"
            name="email"
            type="email"
            required
          />
          <TextInput
            label="Password"
            id="login_password"
            name="password"
            type="password"
            required
          />

          {this.state.submitting
            ? <Loader />
            : <button type="submit" className="btn-primary">
                Login
              </button>
          }
        </Form>
        {this.state.responseMsg && <div>{this.state.responseMsg}</div>}
      </>
    )
  }
}
