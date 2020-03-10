import React from 'react'
import Loader from './Loader'

export default class extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      listing: {}
    }
  }

  componentDidMount () {
    this.loadListing()
  }

  loadListing = async () => {
    const response = await fetch(`http://localhost:5000/listings/${
      this.props.match.params.id
    }`)
    const listing = await response.json()
  
    this.setState({ listing })
  }

  render () {
    const { title, description } = this.state.listing

    return (
      <main>
        {title && description ? (
          <>
            <h1>{title}</h1>
            <p>{description}</p>
          </>
        ) : <Loader />}
      </main>
    )
  }
}
