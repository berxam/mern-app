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
import getUser from '../helpers/getUser'

export default class extends Component {
  constructor (props) {
    super(props)
    this.state = {
      mobileNavIsOpen: false
    }
  }

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
                  <Link to="/" className="logo">Swapza</Link>

                  <div className={this.state.mobileNavIsOpen ? 'active' : ''}>
                    {context.isAuthenticated ? (
                      <>
                        <NotificationButton />
                        <IconButton
                          to="/create"
                          label="Luo uusi"
                          title="Luo uusi listaus"
                          icon="edit-1"
                        />
                        <IconButton
                          to={'/users/' + getUser().id}
                          label="Profiili"
                          title="Katso ja muokkaa omaa profiiliasi"
                          icon="user-2"
                        />
                        <IconButton
                          onClick={() => context.logout()}
                          label="Kirjaudu ulos"
                          title="Kirjaudu ulos"
                          icon="padlock-1"
                        />
                      </>
                    ) : (
                      <>
                        <IconButton
                          onClick={() => this.openSignupModal()}
                          label="Rekisteröidy"
                          icon="mail"
                        />
                        <IconButton
                          onClick={() => this.openLoginModal()}
                          label="Kirjaudu"
                          icon="padlock"
                        />
                      </>
                    )}
                  </div>
                  <IconButton
                    onClick={() => this.setState(({ mobileNavIsOpen }) => ({
                      mobileNavIsOpen: !mobileNavIsOpen
                    }))}
                    label="Menu"
                    icon="dial"
                    className="menu-toggler"
                  />
                </nav>
              </div>
            </header>
          </>
        )}
      </AuthContext.Consumer>
    )
  }
}
