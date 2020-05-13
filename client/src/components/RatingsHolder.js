import React, { Component } from 'react'

export default class extends Component {
  constructor (props) {
    super(props)
    this.state = {
      ratingArray: []
    }
  }

  componentDidMount () {
    this.getRatings()
  }


  getRatings = () => {
    for (let i = 0; i < this.props.ratings.length; i++) {
      let item = <p>{this.props.ratings[i].comment}</p>
      this.setState(state => ({
        ratingArray: [...state.ratingArray, item]
      }))
    }
  }

  render () {
    return (
      <>
        {this.state.ratingArray}
      </>
    )
  }
}
