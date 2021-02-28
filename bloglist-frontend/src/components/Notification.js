import React from 'react'
import { useSelector } from 'react-redux'
import Alert from 'react-bootstrap/Alert'

const Notification = () => {
  const notification = useSelector(state => state.notification)
  const notificationMessage = notification.notification
  const notificationType = notification.notificationType
   
  return (
    <div>
      {(notificationMessage &&
      <Alert variant={notificationType}>
        {notificationMessage}
      </Alert>
      )}
    </div>
  )
}

export default Notification