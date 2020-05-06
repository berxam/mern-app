import React, { Component } from 'react'

export default class extends Component {
  render () {
    return (
        <section onClick={this.props.onClick}>
          <p>{this.props.title}</p>
        </section>
    )
  }
}
