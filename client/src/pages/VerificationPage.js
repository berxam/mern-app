import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import createUrl from '../helpers/createUrl'

export default class extends Component {
  constructor (props) {
    super(props)
    this.state = {
      verifying: 'Vahvistetaan sähköpostia...'
    }
  }

  async componentDidMount () {
    const url = createUrl('/users/verify')

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          key: new URLSearchParams(this.props.location.search).get('key')
        })
      })

      if (response.ok) {
        this.setState({ verifying: 'Verified! You can now log in!' })
      } else {
        this.setState({ verifying: 'Could not verify...' })
        console.log(response)
      }
    } catch (error) {
      this.setState({ verifying: 'Could not verify...' })
      console.log(error)
    }
  }

  render () {
    return (
      <main>
        <Helmet>
          <title>Sähköpostin vahvistus</title>
        </Helmet>

        <div className="row">
          <h1>{this.state.verifying}</h1>
        </div>
      </main>
    )
  }
}
