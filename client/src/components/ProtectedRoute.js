import React, { useContext } from 'react'
import { Route, Redirect } from 'react-router-dom'

import getUser from '../helpers/getUser'
import { AuthContext } from './AuthContext'

export default ({ component: Component, render, level, ...rest }) => {
  const authContext = useContext(AuthContext)

  return (
    <Route
      {...rest}
      render={props => {
        const redirect = <Redirect to={{ pathname: "/", state: { from: props.location }}} />

        if (!authContext.isAuthenticated) return redirect

        const { role } = getUser()
        
        if (!role || role < level) return redirect

        return render ? render(props) : <Component {...props} />
      }}
    />
  )
}
