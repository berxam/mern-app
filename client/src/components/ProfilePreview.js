import React, { Component } from 'react'

import fetchWithAuth from '../helpers/fetchWithAuth'
import createUrl from '../helpers/createUrl'
import {Link} from 'react-router-dom'

export default class extends Component {
  constructor (props) {
    super(props)
      this.state = {
          userName: '',
          userRating: [],
          location: ''
      }
  }

  componentDidMount() {
    this.getUser()
  }

  getUser = async () => {
    const url = createUrl(`/users/${this.props.userID}`)
    
    try {
      const response = await fetchWithAuth(url)
      if (response.ok) {
          const user = await response.json()
          console.log(user)
          this.setState({
              userName: user.username,
              userRating: [user.rating.positive, user.rating.negative],
              location: user.location
          })
      } else {
        console.error(response)
      }
    } catch (error) {
      console.error(error)
    }
  }

  render () {
    return (
      <div className="row">
        <section className="d12 m8">
        <h3>
        <Link to={`/users/${this.props.userID}`}>
            {this.state.userName}
        </Link>
        </h3> <br/>
          <p>Palaute:</p>
          <p>{this.state.userRating[0]} Positiivista {this.state.userRating[1]} Negatiivista </p>
          <p>Sijainti: {this.state.location}</p>
        </section>
      </div>
    )
  }
}
