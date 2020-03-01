import React from 'react'

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
        <h1>{title ? title : 'Loading...'}</h1>
        <p>{description ? description : 'Loading...'}</p>
      </main>
    )
  }
}
