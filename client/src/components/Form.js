import React, { Component } from 'react'

/**
 * @param {String}   url       The endpoint to submit the form to.
 * @param {String}   method    HTTP method for submitting.
 * @param {Function} onSuccess Called with response when submitted.
 * @param {Function} onError   Called with error or response error.
 *
 * @param {Function} setLoader Optional. Set parents state for rendering Loader.
 * @param {Function} onSubmit  Optional. Override the forms onSubmit.
 * @param {Boolean}  auth      Optional. Set to true if protected route.
 * @param {Boolean}  multipart Optional. Set to true if sending files.
 */
export default class extends Component {
  submit = async event => {
    const target = event.target
    event.preventDefault()
    this.props.setLoader && this.props.setLoader()

    const formData = new FormData(target)
    const { method, multipart, url } = this.props
    const request = { method }

    if (multipart) {
      request.body = formData
    } else {
      let asJson = {}
      formData.forEach((val, key) => { asJson[key] = val })
      request.body = JSON.stringify(asJson)
      request.headers = { 'Content-Type': 'application/json' }
    }

    if (this.props.auth) {
      request.headers.authorization = `Bearer ${
        JSON.parse(localStorage.getItem('jid')).accessToken
      }`
      request.credentials = 'include'
    }

    try {
      const response = await fetch(url, request)
      
      if (response.ok) {
        target.reset()
        this.props.onSuccess(response)
      } else {
        this.props.onError(response)
      }
    } catch (err) {
      this.props.onError(err)
    }
  }

  render () {
    return (
      <form
        autoComplete="off"
        onSubmit={this.props.onSubmit || this.submit}
      >
        {this.props.children}
      </form>
    )
  }
}
