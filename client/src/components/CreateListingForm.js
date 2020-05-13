import React, { Component } from 'react'

import Form from '../components/Form'
import TextInput from '../components/TextInput'
import TextArea from '../components/TextArea'
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
      <>
        <Form
          auth
          url="http://localhost:5000/listings"
          method="POST"
          multipart
          setLoader={() => this.setState({ submitting: true })}
          onSuccess={() => this.setState({ submitting: false, responseMsg: 'Listaus luotu onnistuneesti!' })}
          onError={() => this.setState({ submitting: false, responseMsg: 'Jotain meni pieleen...' })}
          >
          <TextInput
            label="Listauksen nimi" id="create_title" name="title"
            required
            />
          <TextArea
            label="Tuotteen tai palvelun kuvaus" id="create_description" name="description"
            required
            />
          <FileInput
            label="Kuva(t)"
            id="create_picture"
            name="pics"
            multiple
            />
          <input type="hidden" name="creatorId" value={
            JSON.parse(localStorage.getItem('jid')).id
          } />
  
          {this.state.submitting
            ? <Loader />
            : <button type="submit" className="btn-primary">
                Submit
              </button>
          }
        </Form>
        {this.state.responseMsg && <p>{this.state.responseMsg}</p>}
      </>
    )
  }
}