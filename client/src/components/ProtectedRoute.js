import React, { useContext } from 'react'
import { Route, Redirect } from 'react-router-dom'

import { AuthContext } from './AuthContext'

export default ({ component: Component, render, ...rest }) => {
  const authContext = useContext(AuthContext)

  return (
    <Route
      {...rest}
      render={props => {
        console.log('[ProtectedRoute]', 'Authentication context:', authContext)
        console.log('[ProtectedRoute]',
          authContext.isAuthenticated
            ? 'Authenticated, rendering component...'
            : 'Not authenticated! Redirecting...'
        )

        return (
          authContext.isAuthenticated ? (
            render ? render(props) : <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: "/",
                state: { from: props.location }
              }}
            />
          )
        )
      }}
    />
  )
}
