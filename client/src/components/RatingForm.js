import React, { Component } from 'react'

import Form from './Form'

import fetchWithAuth from '../helpers/fetchWithAuth'
import createUrl from '../helpers/createUrl'
import TextArea from '../components/TextArea'
import getUser from '../helpers/getUser'


export default class extends Component {
  constructor (props) {
    super(props)
      this.state = {
        comment: '',
        isPositive: null
      }
  }

  submit = async (event) => {
    event.preventDefault()
    const url = createUrl(`/users/${this.props.id}/rating`)
    console.log(url)
    const settings = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        creatorId: getUser().id,
        comment: this.state.comment,
        isPositive: this.state.isPositive
      })
    }

    try {
      const response = await fetchWithAuth(url, settings)

      if (response.ok) {
        console.log('palaute annettu')
        window.location.reload()
      } else {
        console.error(response)
      }
    } catch (error) {
      console.error(error)
    }
  }

  changeComment = (event) => this.setState({comment: event.target.value})

  changeRating = (event) => {
      if (event.target.value === 'positive') {
          this.setState({isPositive: true})
      } else {
          this.setState({isPositive: false})
      }
  }

  render () {
    return (
      <Form onSubmit={this.submit}>
        <TextArea
            label="Kommentoi" id="description_id" name="description" onChange={this.changeComment} required
        />
        <div onChange={this.changeRating}>
        <p>Suosittelisitko myyjää?</p>
        <input type="radio" id ="positive" value="positive" name="rating" /> <label htmlFor="positive">Kyllä</label><br/>
        <input type="radio" id ="negative" value="negative" name="rating" /> <label htmlFor="negative">En</label>
        </div>
        <button type="submit" className="btn-primary">
          Anna palaute
        </button>
      </Form>
    )
  }
}
