import React from 'react'
import loginService from '../services/login'
import blogService from '../services/blogs'
import { useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'
import { setUser } from '../reducers/userReducer'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

const LoginForm = () => {

    const dispatch = useDispatch()
    const handleLogin = async (event) => {
        event.preventDefault()
        try {
          const user = await loginService.login({
            username: event.target.username.value, password: event.target.password.value,
          })
    
          window.localStorage.setItem(
            'loggedBlogappUser', JSON.stringify(user)
          )
          blogService.setToken(user.token)
          dispatch(setUser(user))
          dispatch(setNotification('Login success', 'success'))
        } catch (exception) {
          dispatch(setNotification('Wrong credentials', 'danger'))
        }
      }
    
    return(
        <div>
            <h2>Login</h2>
            <Form onSubmit={handleLogin}>
                <Form.Group>
                    <Form.Label>username:</Form.Label>
                    <Form.Control
                    id="username"
                    type="text"
                    name="username"
                    />
    
                    <Form.Label>password:</Form.Label>
                    <Form.Control
                        id="password"
                        type="password"
                        name="password"
                    />
                    <Button id="login-button" variant="primary" type="submit">
                        Login
                    </Button>
                </Form.Group>
            </Form>
        </div>
    )
}
export default LoginForm