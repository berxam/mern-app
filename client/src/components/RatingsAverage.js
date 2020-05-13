import React, { Component } from 'react'

export default class extends Component {
  constructor (props) {
    super(props)
    this.state = {
      votes: 0,
      totalPositive: 0,
      totalNegative: 0
    }
  }

  componentDidMount () {
    this.getVotes()
  }


  getVotes = () => {
      let votes = 0
      let totalPositive = 0
      let totalNegative = 0
    for (let i = 0; i < this.props.ratings.length; i++) {
      if (this.props.ratings[i].isPositive) {
          votes++
          totalPositive++
      } else {
          votes--
          totalNegative++
      }
    }
    this.setState({votes: votes})
    this.setState({totalPositive: totalPositive})
    this.setState({totalNegative: totalNegative})
  }

  render () {
    return (
      <>
        <p>{this.state.votes} Pistettä {this.state.totalPositive} Positiivista {this.state.totalNegative} Negatiivista</p>
      </>
    )
  }
}
