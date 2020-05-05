import React, { Component } from 'react'
import { Helmet } from 'react-helmet'

import Loader from '../components/Loader'

export default class extends Component {
  constructor (props) {
    super(props)
    this.state = {
      user: {}
    }
  }

  componentDidMount () {
    this.loadUser()
  }

  loadUser = async () => {
    try {
      const response = await fetch(`http://localhost:5000/users/${
        this.props.match.params.id
      }`)
      const user = await response.json()
  
      this.setState({ user })
    } catch (error) {
      console.error('[userPage:loaduser]', error)
    }
  }

  render () {
    const { username, rating } = this.state.user

    return (
      <main>
        {username && rating ? (
          <>
            <Helmet>
              <title>{username}</title>
            </Helmet>

            <h1>{username}</h1>

            <h2>Listaukset</h2>
          </>
        ) : <Loader />}
      </main>
    )
  }
}
