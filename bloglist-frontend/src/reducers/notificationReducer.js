const notificationReducer = (state = {notification: '', notificationType: '', timeoutId: ''}, action) => {
    let newState = {...state}
    switch (action.type) {
      case 'SHOW_NOTIFICATION':
        return { ...state,
                notification: action.notification,
                notificationType: action.notificationType
        }
      case 'HIDE_NOTIFICATION':
        return { notification: '',
        notificationType: '',
        timeoutId: ''
        }
      case 'SET_ID':
        newState.timeoutId = action.timeoutId
        return newState
      
      default:
        return state
    }
}
  
  const showNotification = (notification, notificationType) => {
    return {
      type: 'SHOW_NOTIFICATION',
      notification,
      notificationType
    }
  }
  
  const hideNotification = () => {
    return {
      type: 'HIDE_NOTIFICATION',
      notification: '',
    }
  }

  const setTimeoutId = (timeoutId) => {
    return {
      type: 'SET_ID',
      timeoutId
    }
  }

  export const setNotification = (notification, notificationType, durationInSeconds = 5) => {
    return (dispatch, getState) => {

    const timeoutId = getState().notification.timeoutId
    if(timeoutId !== '') {
      clearTimeout(timeoutId)
    }

    dispatch(showNotification(notification, notificationType))

    const newTimeoutId = setTimeout(() => {
      dispatch(hideNotification())
      dispatch(setTimeoutId(''))
    }, durationInSeconds * 1000)
    dispatch(setTimeoutId(newTimeoutId))
    }
  }

  export default notificationReducer