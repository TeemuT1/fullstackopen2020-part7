import React, { useEffect } from 'react'
import NavMenu from './components/NavMenu'
import Blog from './components/Blog'
import Blogs from './components/Blogs'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Users from './components/Users'
import User from './components/User'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import blogService from './services/blogs'
import { setNotification } from './reducers/notificationReducer'
import { initializeBlogs } from './reducers/blogReducer'
import { initializeUsers } from './reducers/usersReducer'
import { setUser } from './reducers/userReducer'
import { useDispatch, useSelector } from 'react-redux'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useRouteMatch,
  useHistory,
} from "react-router-dom"

const App = () => {

  const history = useHistory()
  const blogFormRef = React.createRef()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])
  
  useEffect(() => {
    dispatch(initializeUsers())
  }, [dispatch])


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }, [dispatch])

  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)
  const users = useSelector(state => state.users)

  const handleLogout = (event) => {
    event.preventDefault()

    window.localStorage.removeItem('loggedBlogappUser')
    dispatch(setUser(null))
    dispatch(setNotification('Logout success', 'success'))
    history.push('/')
  }

  const blogForm = () => (
    <Togglable buttonLabel='New blog' ref={blogFormRef}>
      <BlogForm/>
    </Togglable>
  )

  const matchBlog = useRouteMatch('/blogs/:id')
  const displayedBlog = matchBlog
    ? blogs.find(blog => blog.id === matchBlog.params.id)
    : null

  const matchUser = useRouteMatch('/users/:id')
  const displayedUser = matchUser 
    ? users.find(user => user.id === matchUser.params.id)
    : null

  if (!user) {

    return (
      <div className="container">
        <Notification/>
        <LoginForm/>
      </div>
    )
  }
  return (
    <div className="container">
      <NavMenu handleLogout={ handleLogout }/>
      
      <Notification/>
      
      <Switch>

        <Route path="/users/:id">
          <User user={ displayedUser }/>
        </Route>

        <Route path="/users">
          <Users/>
        </Route>

        <Route path="/blogs/:id">
          <Blog blog={ displayedBlog }/>
        </Route>

        <Route path="/">
        {blogForm()}
          <Blogs/>
        </Route>

      </Switch>
    </div>
  )
}

export default App