import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Navbar from './components/Navbar'
import LandingPage from './components/LandingPage'
import ListingHolder from './components/ListingHolder'
import ListingDetails from './components/ListingDetails'
import SignUpModal from './components/SignUpModal'
import './styles/modal.scss'
import './styles/forms.scss'

export default class extends Component {
  constructor (props) {
    super(props)
    this.state = {
      modalIsOpen: false
    }
  }
  
  componentDidMount () {
    document.addEventListener('mousedown', e => {
      if (this.modalRef && !this.modalRef.contains(e.target)) {
        this.closeModal()
      }
    })
  }

  setModalRef = (ref) => {
    this.modalRef = ref
  }

  openModal = () => {
    this.setState({ modalIsOpen: true })
  }

  closeModal = () => {
    this.setState({ modalIsOpen: false })
  }

  render () {
    return (
      <Router>
        <Navbar openModal={this.openModal} />
        <Switch>
          <Route path="/" exact component={LandingPage} />
          <Route path="/listings" exact component={ListingHolder} />
          <Route path="/listings/:id" component={ListingDetails} />
        </Switch>
        <div className={'modal-bg ' + (this.state.modalIsOpen ? 'active' : '')}>
          <SignUpModal setRef={this.setModalRef} closeModal={this.closeModal} />
        </div>
      </Router>
    )
  }
}
