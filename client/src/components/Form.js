import React, { Component } from 'react'

export default class extends Component {
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
  constructor (props) {
    super(props)
    this.formData = props.multipart ? new FormData() : {}
  }

  updateFormData = (event) => {
    const { name, value, type, files } = event.target

    if (files) {
      console.log('target has files')
    } else {
      if (this.formData instanceof FormData) {
        this.formData.append(name, value)
      } else {
        this.formData[name] = value
      }
    }
  }

  submit = async event => {
    const target = event.target
    
    console.log(new FormData(target))
    console.dir(target)
    // Use this to update parents state
    this.props.setLoader && this.props.setLoader()
    
    const { method, multipart, url } = this.props
    const request = {
      method,
      body: multipart ? new FormData(target) : JSON.stringify(this.formData)
    }
    if (!multipart) {
      request.headers['Content-Type'] = 'application/json'
    }
    
    if (this.props.auth) {
      request.headers.authorization = `Bearer ${
        JSON.parse(localStorage.getItem('jid')).accessToken
      }`
      request.credentials = 'include'
    }
    
    event.preventDefault()
    try {
      const response = await fetch(url, request)
      
      if (response.ok) {
        // target.reset()
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
        onChange={this.updateFormData}
        onSubmit={this.props.onSubmit || this.submit}
      >
        {this.props.children}
      </form>
    )
  }
}
