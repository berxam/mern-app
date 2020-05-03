import React, { Component } from 'react'

import '../styles/modal.scss'

export default class extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isOpen: false
    }
  }
  
  componentDidMount () {
    document.addEventListener('mousedown', this.outClick)
    // Give parents access to opening
    this.props.setOpener(this.open)
  }

  componentWillUnmount () {
    document.removeEventListener('mousedown', this.outClick)
  }

  setRef = (ref) => {
    this.modalRef = ref
  }

  outClick = (event) => {
    if (this.modalRef && !this.modalRef.contains(event.target)) {
      this.hide()
    }
  }

  open = () => {
    this.setState({ isOpen: true })
  }

  hide = () => {
    this.setState({ isOpen: false })
  }
  
  render () {
    return (
      <div className={'modal-bg' + (this.state.isOpen ? ' active' : '')}>
        <div ref={this.setRef} className="modal">
          <button
            title="Close popup"
            aria-label="Close popup"
            onClick={this.hide}
            className="btn-close">
          </button>

          {this.props.children}
        </div>
      </div>
    )
  }
}
