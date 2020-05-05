import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import SignUpForm from './SignUpForm'
import LoginForm from './LoginForm'
import Modal from './Modal'
import NotificationButton from './Notifications'
import IconButton from './IconButton'

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
                  <Link to="/" className="logo">Vaihtokauppa</Link>

                  {context.isAuthenticated ? (
                    <div>
                      <NotificationButton />
                      <IconButton
                        to="/create"
                        label="Create"
                        title="Create new listing"
                        icon="edit-1"
                      />
                      <IconButton
                        onClick={() => context.logout()}
                        label={JSON.parse(localStorage.getItem('jid')).username}
                        title="Should drop down links to profile, settings, log out"
                        icon="user-2"
                      />
                    </div>
                  ) : (
                    <div>
                      <IconButton
                        onClick={() => this.openSignupModal()}
                        label="Sign up"
                        icon="mail"
                      />
                      <IconButton
                        onClick={() => this.openLoginModal()}
                        label="Sign in"
                        icon="padlock"
                      />
                    </div>
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
