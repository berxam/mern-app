import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Navbar from './components/Navbar'
import LandingPage from './components/LandingPage'
import ListingHolder from './components/ListingHolder'
import ListingDetails from './components/ListingDetails'

export default () => (
  <Router>
    <Navbar />
    <Switch>
      <Route path="/" exact component={LandingPage} />
      <Route path="/listings" exact component={ListingHolder} />
      <Route path="/listings/:id" component={ListingDetails} />
    </Switch>
  </Router>
)
