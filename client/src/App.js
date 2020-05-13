import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  withRouter
} from 'react-router-dom'
import { Helmet } from 'react-helmet'

import ROLES from './helpers/roles'
import { AuthProvider } from './components/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import ListingPage from './pages/ListingPage'
import ProfilePage from './pages/ProfilePage'
import VerificationPage from './pages/VerificationPage'
import CreateListingPage from './pages/CreateListingPage'

export default () => (
  <Router>
    <AuthProvider>
      <Helmet titleTemplate="%s - Swapza" />

      <Navbar />

      <div className="wrap">
        <Switch>
          <Route path="/" exact component={LandingPage} />
          <Route path="/listings/:id" component={withRouter(ListingPage)} />
          <Route path="/users/:id" component={withRouter(ProfilePage)} />
          <Route path="/verify" component={VerificationPage} />

          <ProtectedRoute level={ROLES.BASIC} path="/create" component={CreateListingPage} />
          <ProtectedRoute level={ROLES.ADMIN} path="/admin" render={() => 'admin'} />

          <Route render={() => '404 Not found'}/>
        </Switch>
      </div>
    </AuthProvider>
  </Router>
)
