import React, { Component } from 'react'
import { Helmet } from 'react-helmet'

import Form from '../components/Form'
import TextInput from '../components/TextInput'
import FileInput from '../components/FileInput'
import Loader from '../components/Loader'

export default class extends Component {
  constructor (props) {
    super(props)
    this.state = {
      responseMsg: '',
      submitting: false
    }
  }

  render () { 
    return (
      <main className="d12">
        <Helmet>
          <title>Create listing</title>
        </Helmet>

        <h1>Create listing</h1>
        <Form
          url="http://localhost:5000/listings"
          method="POST"
          multipart
          setLoader={() => this.setState({ submitting: true })}
          onSuccess={() => this.setState({ submitting: false })}
          onError={() => this.setState({ submitting: false })}
        >
          <TextInput
            label="Product or service name" id="create_title" name="title"
            required
          />
          <TextInput
            label="Description" id="create_description" name="description"
            required
          />
          <FileInput
            label="Picture(s)"
            id="create_picture"
            name="pics"
            multiple
          />

          {this.state.submitting
            ? <Loader />
            : <button type="submit" className="btn-primary">
                Submit
              </button>
          }
        </Form>

        {this.state.responseMsg && <div>{this.state.responseMsg}</div>}
      </main>
    )
  }
}
