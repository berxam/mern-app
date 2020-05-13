import React, { Component, createContext } from 'react'
import jwtDecode from 'jwt-decode'

import getUser from '../helpers/getUser'
import createUrl from '../helpers/createUrl'
import fetchWithAuth from '../helpers/fetchWithAuth'

export const AuthContext = createContext({
  isAuthenticated: false,
  login: () => {},
  logout: () => {}
})

export class AuthProvider extends Component {
  constructor (props) {
    super(props)
    this.refreshTimeout = null
    this.state = {
      // Load initial state from storage to prevent redirect
      isAuthenticated: null !== localStorage.getItem('jid')
    }
  }

  componentDidMount () {
    const user = getUser()

    if (user !== null) {
      if (!this.setAccessToken(user.accessToken)) {
        this.refresh()
      }
    }
  }

  componentWillUnmount () {
    clearTimeout(this.refreshTimeout)
  }

  login = async (formData) => {
    const url = createUrl('/auth/login')

    try {
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const { accessToken } = await response.json()
        return this.setAccessToken(accessToken)
      } else {
        return response.status
      }
    } catch (err) {
      return err
    }
  }

  logout = async () => {
    const url = createUrl('/auth/logout')

    try {
      const response = await fetchWithAuth(url, {
        method: 'DELETE'
      })

      switch (response.status) {
        case 204:
          console.log('[logout]', 'Refresh token is now invalidated.')
          break
        case 401:
          console.error('[logout]', 'Invalid or empty refresh token sent.')
          break
        case 403:
          console.error('[logout]', 'Refresh token was already invalidated.')
          break
        default:
          console.error('[logout]', 'Something went wrong with the request')
      }
    } catch (err) {
      console.error('[logout]', err)
    }

    this.removeAccess()
  }

  refresh = async () => {
    const url = createUrl('/auth/refresh')

    try {
      const response = await fetch(url, {
        credentials: 'include'
      })

      if (response.ok) {
        const { accessToken } = await response.json()
        this.setAccessToken(accessToken)
      } else {
        this.setState({ isAuthenticated: false })
        console.error('[refresh]', 'Something went wrong')
      }
    } catch (err) {
      this.setState({ isAuthenticated: false })
      console.error('[refresh]', err)
    }
  }

  setAccessToken = accessToken => {
    const { id, exp /*sec*/, username, role } = jwtDecode(accessToken)
    const expiresAt = new Date(exp * 1000 /*ms*/)
    const today = new Date()
    const toExpire = expiresAt - today

    if (toExpire <= 0) {
      this.removeAccess()
      return false
    }

    localStorage.setItem('jid', JSON.stringify({ id, accessToken, username, role }))
    this.setState({ isAuthenticated: true })

    clearTimeout(this.refreshTimeout)
    this.refreshTimeout = setTimeout(this.refresh, toExpire)

    return true
  }

  removeAccess = () => {
    localStorage.removeItem('jid')
    this.setState({ isAuthenticated: false })
    clearTimeout(this.refreshTimeout)
  }

  render () {
    return (
      <AuthContext.Provider
        value={{
          isAuthenticated: this.state.isAuthenticated,
          login: this.login,
          logout: this.logout
        }}
      >
        { this.props.children }
      </AuthContext.Provider>
    )
  }
}
