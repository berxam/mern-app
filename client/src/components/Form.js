import React, { Component } from 'react'

import fetchWithAuth from '../helpers/fetchWithAuth'
import createUrl from '../helpers/createUrl'

/**
 * @param {String}   url       The endpoint to submit the form to.
 * @param {String}   method    HTTP method for submitting.
 * @param {Function} onSuccess Called with response when submitted.
 * @param {Function} onError   Called with error or response error.
 * @param {Function} setLoader Optional. Set parents state for rendering Loader.
 * @param {Function} onSubmit  Optional. Override the forms onSubmit.
 * @param {Boolean}  auth      Optional. Set to true if protected route.
 * @param {Boolean}  multipart Optional. Set to true if sending files.
 */
export default class extends Component {
  /** @param {FormData} formData */
  initRequest = (formData) => {
    let { method = 'GET', multipart, url } = this.props
    const request = { method }

    let asJson = {}
    formData.forEach((val, key) => { asJson[key] = val })

    if (method.toUpperCase() === 'GET') {
      url = createUrl(url, asJson)
    } else if (multipart) {
      request.body = formData
    } else {
      request.body = JSON.stringify(asJson)
      request.headers = { 'Content-Type': 'application/json' }
    }

    return [url, request]
  }

  submit = async event => {
    const target = event.target
    event.preventDefault()
    this.props.setLoader && this.props.setLoader()
    const formData = new FormData(target) 
    const [url, request] = this.initRequest(formData)   

    try {
      const response = this.props.auth
        ? await fetchWithAuth(url, request)
        : await fetch(url, request)

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
