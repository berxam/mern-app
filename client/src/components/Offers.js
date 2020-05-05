import React, { Component } from 'react'

export default class extends Component {
    constructor (props) {
      super(props)
    }
  
    componentDidMount () {
        
    }
  
    render () {
    const offers = this.props.offers
    const listItems = offers.map((offer) =>
      <p>{offer.user} {offer.offer}</p>
      )

      return (
        <section>
            {listItems}
        </section>
      )
    }
  }