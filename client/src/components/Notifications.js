import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'

import IconButton from './IconButton'
import '../styles/Notifications.scss'

const NotificationPanel = (props) => {
  return (
    <div
      aria-labelledby="notifications"
      className={'expandable' + (props.open ? ' active' : '')}
    >
      <ul>
        {props.notifications.map((notif, idx) => (
          <li key={idx}>
            <Link to={`/listings/${notif.listingId}`}>
              {notif.title}
              {/*<span>{notif.createdAt}</span>*/}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default class NotificationButton extends Component {
  constructor (props) {
    super(props)
    this.state = {
      notifications: [],
      panelIsOpen: false
    }
  }

  async componentDidMount () {
    const user = JSON.parse(localStorage.getItem('jid'))

    try {
      const response = await fetch(`http://localhost:5000/users/${user.id}/notifs`, {
        credentials: 'include',
        headers: {
          authorization: `Bearer ${user.accessToken}`
        }
      })

      if (response.ok) {
        const notifications = await response.json()
        this.setState({ notifications })
      } else {
        console.error(response)
      }
    } catch (error) {
      console.error(error)
    }

    this.notifStream = new EventSource(
      `http://localhost:5000/users/${user.id}/notifs/stream`,
      { withCredentials: true }
    )
    this.notifStream.addEventListener('message', this.onNewNotif)
  }

  componentWillUnmount () {
    if (this.notifStream) {
      this.notifStream.removeEventListener('message', this.onNewNotif)
      this.notifStream.close()
    }
  }

  componentDidUpdate () {
    if (this.state.panelIsOpen && this.getUnreadNotifs().length) {
      this.setState(({ notifications }) => ({
        notifications: notifications.map(notif => {
          // this update should also be saved to database!!!
          if (notif.isUnseen) notif.isUnseen = false
          return notif
        })
      }))
    }
  }

  getUnreadNotifs = () => {
    return this.state.notifications.filter(notif => notif.isUnseen)
  }
  
  onNewNotif = (messageEvent) => {
    console.log('Got new notification!')
    const notif = JSON.parse(messageEvent.data)
    this.setState(state => ({
      notifications: [...state.notifications, notif]
    }))
  }

  render () {
    const unreadNotifs = this.getUnreadNotifs().length

    return (
      <div className="notifs">
        <Helmet
          titleTemplate={unreadNotifs ? `(${unreadNotifs}) %s` : '%s'}
        />

        <IconButton
          onClick={() => this.setState(({ panelIsOpen }) => ({ panelIsOpen: !panelIsOpen }))}
          label="Notifs"
          icon="alarm"
          aria-haspopup="true"
          aria-expanded={this.state.panelIsOpen}
          id="notifications"
          {...(() => unreadNotifs && { 'data-notifs': unreadNotifs })()}
        />
        <NotificationPanel
          open={this.state.panelIsOpen}
          notifications={this.state.notifications}
        />
      </div>
    )
  }
}
