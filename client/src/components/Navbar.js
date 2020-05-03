import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import SignUpForm from './SignUpForm'
import LoginForm from './LoginForm'
import Modal from './Modal'
import NotificationButton from './Notifications'

import { AuthContext } from './AuthContext'

import '../styles/Navbar.scss'
import '../styles/forms.scss'

export default class extends Component {
  render () {
    return (
      <AuthContext.Consumer>
        {context => (
          <>
            {context.isAuthenticated || (
              <>
                <Modal setOpener={open => this.openSignupModal = open}>
                  <SignUpForm />
                </Modal>
    
                <Modal setOpener={open => this.openLoginModal = open}>
                  <LoginForm />
                </Modal>
              </>
            )}
    
            <header className="navbar">
              <div className="wrap">
                <nav>
                  <Link to="/">Home</Link>

                  {context.isAuthenticated ? (
                    <>
                      <NotificationButton />
                      <Link to="/create">Create new</Link>
                      <button
                        onClick={() => context.logout()}
                        className="btn">
                        Log out
                        {/* Change this button into a user icon,
                        which drops down Profile, Settings, Log out */}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => this.openSignupModal()}
                        className="btn-primary">
                        Sign up
                      </button>
                      <button
                        onClick={() => this.openLoginModal()}
                        className="btn">
                        Sign in
                      </button>
                    </>
                  )}
                </nav>
              </div>
            </header>
          </>
        )}
      </AuthContext.Consumer>
    )
  }
}
