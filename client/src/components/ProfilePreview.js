import React, { Component } from 'react'

import fetchWithAuth from '../helpers/fetchWithAuth'
import createUrl from '../helpers/createUrl'

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
        <div className="profilePreview">
          <h3>{this.state.userName}</h3>
          <p>posi = {this.state.userRating[0]} nega = {this.state.userRating[1]}</p>
          <p>location: {this.state.location}</p>
        </div>
    )
  }
}
