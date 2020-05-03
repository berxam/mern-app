import React, { Component } from 'react'
import { Helmet } from 'react-helmet'

const NotificationPanel = (props) => {
  return (
    <div
      aria-labelledby="notifications"
      className={'expandable' + (props.open ? ' active' : '')}
    >
      <ul>
        {props.notifications.map(notif => (
          <li
            key={notif._id}
          >
            {notif.title}
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
      notifications: [
        {_id: 1, title: 'Joku teki jottaii jossai'},
        {_id: 2, title: 'Joku teki jottaii jossai'},
        {_id: 3, title: 'Joku teki jottaii jossai'},
        {_id: 4, title: 'Joku teki jottaii jossai'}
      ],
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
  
  onNewNotif = (messageEvent) => {
    console.log('Got new notification!')
    const notif = JSON.parse(messageEvent.data)
    this.setState(state => ({
      notifications: [...state.notifications, notif]
    }))
  }

  // todo:
  // - bell icon
  // - red ball to corner with unreadNotifsAmount
  render () {
    return (
      <div className="notifs">
        <Helmet
          titleTemplate={this.state.notifications.length
            ? `(${this.state.notifications.length}) %s`
            : '%s'}
        />
        <button
          id="notifications"
          aria-haspopup="true"
          aria-expanded={this.state.panelIsOpen}
          onClick={() => this.setState(({ panelIsOpen }) => ({ panelIsOpen: !panelIsOpen }))}
        >
          Notifs
        </button>
        <NotificationPanel
          open={this.state.panelIsOpen}
          notifications={this.state.notifications}
        />
      </div>
    )
  }
}
