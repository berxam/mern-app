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
      responseMsg: 'Registered! Verify your email.'
    })
  }

  onError = async (err) => {
    if (err instanceof Response) {
      const body = await err.json()
      let errors = []

      for (const key in body.errors) {
        errors.push(body.errors[key].message)
      }

      this.setState({
        submitting: false,
        responseMsg: errors.join(' ')
      })
    } else {
      this.setState({
        submitting: false,
        responseMsg: "Couldn't reach server!"
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
            label="Email" id="signup_email" name="email" type="email" required
          />
          <TextInput
            label="Username" id="signup_username" name="username" required
          />
          <TextInput
            label="Password" id="signup_password" name="password" type="password" required
          />

          {this.state.submitting
            ? <Loader />
            : <button type="submit" className="btn-primary">
                Sign up
              </button>
          }
        </Form>
        {this.state.responseMsg && <div>{this.state.responseMsg}</div>}
      </>
    )
  }
}
