import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/Navbar.scss'

export default () => (
  <header className="navbar">
    <nav>
      <Link to="/">Home</Link>
      <Link to="/listings">Listings</Link>
    </nav>
  </header>
)
