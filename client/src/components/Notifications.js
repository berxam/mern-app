import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'

import fetchWithAuth from '../helpers/fetchWithAuth'
import createUrl from '../helpers/createUrl'
import getUser from '../helpers/getUser'

import IconButton from './IconButton'
import '../styles/Notifications.scss'

const formatTime = (time) => {
  const date = new Date(time)
  return date.toLocaleString()
}

const Notification = (props) => {
  const { _id, listingId, title, createdAt } = props
  const userId = getUser().id

  const remove = async () => {
    const url = createUrl(`/users/${userId}/notifs/${_id}`)
    
    try {
      const res = await fetchWithAuth(url, {
        method: 'DELETE'
      })

      if (res.ok) {
        props.removeNotif()
      } else {
        console.error(res)
      }
    } catch (error) {
      console.error(error)
    }
  }
  
  return (
    <>
      <Link to={`/listings/${listingId}`}>
        <span>{title}</span>
        <span>{formatTime(createdAt)}</span>
      </Link>
      <button
        onClick={remove}
        title="Remove"
        className="btn-close small"
      ></button>
    </>
  )
}

const NotificationPanel = (props) => {
  return (
    <div
      ref={props.setRef}
      aria-labelledby="notifications"
      className={'expandable' + (props.isOpen ? ' active' : '')}
    >
      <ul>
        {props.notifications.map((notif, idx) => (
          <li key={idx} className="notif">
            <Notification {...notif} />
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
        this.setState({
          notifications: notifications.map((notif) => {
            notif.removeNotif = () => {
              this.setState(state => ({
                notifications: state.notifications
                  .filter(n => n._id !== notif._id)
              }))
            }

            return notif
          })
        })
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

  outClick = (event) => {
    if (this.state.panelIsOpen && this.panelRef && !this.panelRef.contains(event.target)) {
      this.hide()
    }
  }

  open = () => {
    this.setState({ panelIsOpen: true })
    document.addEventListener('click', this.outClick)
  }

  hide = () => {
    this.setState({ panelIsOpen: false })
    document.removeEventListener('click', this.outClick)
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
          titleTemplate={unreadNotifs ?
            `(${unreadNotifs}) %s - Swapza`
            : '%s - Swapza'}
        />

        <IconButton
          onClick={() => this.state.panelIsOpen ? this.hide() : this.open()}
          label="Notifs"
          icon="alarm"
          aria-haspopup="true"
          aria-expanded={this.state.panelIsOpen}
          id="notifications"
          {...(() => unreadNotifs && { 'data-notifs': unreadNotifs })()}
        />

        <NotificationPanel
          isOpen={this.state.panelIsOpen}
          setRef={ref => this.panelRef = ref}
          notifications={this.state.notifications}
        />
      </div>
    )
  }
}
