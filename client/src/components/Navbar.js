import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/Navbar.scss'

export default (props) => (
  <header className="navbar">
    <div className="wrap">
      <nav>
        <Link to="/">Home</Link>
        <Link to="/listings">Listings</Link>
        <button onClick={props.openModal} className="btn-primary">Sign up</button>
        <button className="btn">Sign in</button>
      </nav>
    </div>
  </header>
)
