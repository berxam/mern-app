import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './components/AuthContext'
import Navbar from './components/Navbar'

import LandingPage from './pages/LandingPage'
import ListingPage from './pages/ListingPage'
import CreateListingPage from './pages/CreateListingPage'

export default () => (
  <Router>
    <AuthProvider>
      <Navbar />

      <div className="wrap">
        <Switch>
          <Route path="/" exact component={LandingPage} />
          <Route path="/listings/:id" component={ListingPage} />
          
          {/*
            <Route path="/users/:id" component={ProfilePage} />
            <Route path="/search" component={SearchPage} />
          */}

          <ProtectedRoute
            path="/create"
            component={CreateListingPage}
          />
          <ProtectedRoute
            path="/settings"
            render={() => 'settings'}
            /*component={SettingsPage}*/
          />
        </Switch>
      </div>
    </AuthProvider>
  </Router>
)
