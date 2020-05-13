import React, { Component } from 'react'

import Form from '../components/Form'
import TextInput from '../components/TextInput'
import TextArea from '../components/TextArea'
import FileInput from '../components/FileInput'
import Loader from '../components/Loader'
import createUrl from '../helpers/createUrl'
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
          url={createUrl('/listings')}
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
          <TextInput
            label="Avainsanoja tuotteelle (erottele pilkulla)" id="create_keywords" name="keywords"
            required
          />
          <FileInput
            label="Kuva(t)"
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
        {this.state.responseMsg && <p>{this.state.responseMsg}</p>}
      </>
    )
  }
}