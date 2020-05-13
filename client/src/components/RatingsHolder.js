import React, { Component } from 'react'
import { Helmet } from 'react-helmet'

import Loader from '../components/Loader'
import ListingHolder from '../components/ListingHolder'
import ListingPreview from '../components/ListingPreview'
import EditForm from '../components/EditForm'
import Modal from '../components/Modal'
import getUser from '../helpers/getUser'
import RatingForm from '../components/RatingForm'

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
