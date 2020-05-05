import React, { Component } from 'react'

import ListingHolder from '../components/ListingHolder'

export default class extends Component {


  constructor (props) {
    super(props)
    
  }

  componentDidMount() {
    
  }

   getListings = () => {
     if (this.props.creatorId == JSON.parse(localStorage.getItem('jid')).id) {
       const item = <p>{this.props.title}</p>
       return item
     } 
   }

  render () {
    return (
        <section onClick={this.props.onClick}>

          {this.getListings()}
        </section>
    )
  }
}
