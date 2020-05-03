import React, { Component, createContext } from 'react'
import jwtDecode from 'jwt-decode'

export const AuthContext = createContext({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  refresh: () => {}
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
    const jid = localStorage.getItem('jid')

    if (jid !== null) {
      const { accessToken } = JSON.parse(jid)
      console.log('[AuthProvider:didMount]', 'Found accesstoken in localStorage')
      const success = this.setAccessToken(accessToken)
      if (!success) this.refresh()
    }
  }

  componentWillUnmount () {
    clearTimeout(this.refreshTimeout)
  }

  login = async (formData) => {
    console.log('[login]', 'Trying to log in with body', formData)

    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const { accessToken } = await response.json()
        console.log('[login]', 'Got accesstoken:', accessToken)
        return this.setAccessToken(accessToken)
      } else {
        console.error('[login]', 'Something went wrong')
      }
    } catch (err) {
      console.error('[login]', err)
    }

    return false
  }

  logout = async () => {
    try {
      const response = await fetch('http://localhost:5000/auth/logout', {
        credentials: 'include',
        headers: {
          authorization: `Bearer ${
            JSON.parse(localStorage.getItem('jid')).accessToken
          }`
        }
      })

      switch (response.status) {
        case 204:
          console.log('[logout]', 'Refresh token is now invalidated.')
          break
        case 401:
          console.log('[logout]', 'Invalid or empty refresh token sent.')
          break
        case 403:
          console.log('[logout]', 'Refresh token was already invalidated.')
          break
        default:
          console.error('[logout]', 'Something went wrong with the request')
      }
    } catch (err) {
      console.error('[logout]', err)
    }

    localStorage.removeItem('jid')
    this.setState({ isAuthenticated: false })
    clearTimeout(this.refreshTimeout)
  }

  refresh = async () => {
    try {
      console.log('[refresh]', 'Refreshing tokens...')
      const response = await fetch('http://localhost:5000/auth/refresh', {
        credentials: 'include'
      })

      if (response.ok) {
        const { accessToken } = await response.json()
        this.setAccessToken(accessToken)
        console.log('[refresh]', 'Got new accesstoken:', accessToken)
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
    const { id, exp /*sec*/ } = jwtDecode(accessToken)
    const expiresAt = new Date(exp * 1000 /*ms*/)
    const today = new Date()
    const toExpire = expiresAt - today

    console.log('[setAccessToken]', 'Saving token to state & storage...')
    console.log('[setAccessToken]', 'Token expires in', toExpire + 'ms')
    console.log('Today', today)

    if (toExpire <= 0) {
      console.error('[setAccessToken]', `The token has expired at ${expiresAt}, so we're no longer authenticated.`)
      localStorage.removeItem('jid')
      this.setState({ isAuthenticated: false })
      clearTimeout(this.refreshTimeout)
      return false
    }

    localStorage.setItem('jid', JSON.stringify({ id, accessToken }))
    this.setState({ isAuthenticated: true })
    clearTimeout(this.refreshTimeout)
    this.refreshTimeout = setTimeout(this.refresh, toExpire)
    console.log('[setAccessToken]', 'Saved! Next refresh at ' + expiresAt)

    return true
  }

  render () {
    return (
      <AuthContext.Provider
        value={{
          isAuthenticated: this.state.isAuthenticated,
          login: this.login,
          logout: this.logout,
          refresh: this.refresh
        }}
      >
        { this.props.children }
      </AuthContext.Provider>
    )
  }
}
