import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'

import fetchWithAuth from '../helpers/fetchWithAuth'
import createUrl from '../helpers/createUrl'
import getUser from '../helpers/getUser'

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
    const { id } = getUser()
    const dbUrl = createUrl(`/users/${id}/notifs`)
    const streamUrl = createUrl(`/users/${id}/notifs/stream`)

    try {
      const response = await fetchWithAuth(dbUrl)

      if (response.ok) {
        const notifications = await response.json()
        this.setState({ notifications })
      } else {
        console.error(response)
      }
    } catch (error) {
      console.error(error)
    }

    this.notifStream = new EventSource(streamUrl, { withCredentials: true })
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
      this.markNotifsAsSeen()
    }
  }

  getUnreadNotifs = () => {
    return this.state.notifications.filter(notif => notif.isUnseen)
  }
  
  onNewNotif = (messageEvent) => {
    const notif = JSON.parse(messageEvent.data)

    this.setState(state => ({
      notifications: [notif, ...state.notifications]
    }))
  }

  markNotifsAsSeen = async () => {
    this.setState(({ notifications }) => ({
      notifications: notifications.map(notif => {
        if (notif.isUnseen) notif.isUnseen = false
        return notif
      })
    }))

    const url = createUrl(`/users/${getUser().id}/notifs/mark-read`)

    try {
      const response = await fetchWithAuth(url, { method: 'PUT' })

      if (response.ok) {
        console.log('Notifs marked as seen!')
      } else {
        console.error('Something went wrong', response)
      }
    } catch (error) {
      console.error(error)
    }
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
