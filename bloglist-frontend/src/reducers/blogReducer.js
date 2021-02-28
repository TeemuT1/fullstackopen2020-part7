import blogService from '../services/blogs'
import { setNotification } from './notificationReducer'

const compareLikes = (a, b) => { return b.likes - a.likes }

const blogReducer = (state = [], action) => {
  console.log('state now: ', state)
  console.log('action', action)

  switch(action.type) {

    case 'ADD_COMMENT':
      const newComment = {...action.data}
      const blogToComment = state.find(blog => blog.id === newComment.blog)
      const commentedBlog = {
        ...blogToComment,
        comments: blogToComment.comments.concat(newComment)
      }
      return state.map(blog => blog.id !== newComment.blog ? blog : commentedBlog)

    case 'LIKE_BLOG':
      const blogToLike = state.find(blog => blog.id === action.data)
      const changedBlog = {
        ...blogToLike,
        likes: blogToLike.likes + 1
      }
      return state.map(blog => blog.id !== action.data ? blog : changedBlog).slice().sort(compareLikes)
    
    case 'NEW_BLOG':
      return [...state, action.data]
    
    case 'DELETE_BLOG':
      return state.filter(blog => blog.id !== action.data)

    case 'INIT_BLOGS':
      return action.data

    default:
      return state
  }
}

export const likeBlog = (id) => {
  return async dispatch => {
    try {
        const blogToLike = await blogService.getOne(id)
        const updatedBlog = { 
          ...blogToLike, 
          likes: blogToLike.likes + 1, 
          user: blogToLike.user.id, 
          comments: blogToLike.comments.map(comment => comment.id)
        }
        await blogService.update(id, updatedBlog)

        dispatch({
        type: 'LIKE_BLOG',
        data: id,
        })
    } catch(exception) {
        dispatch(setNotification(`Error when trying to like the blog`, 'danger'))
    }
  }
}

export const createBlog = (content) => {
  return async dispatch => {
    try {
        const newBlog = await blogService.create(content)
        dispatch({
        type:'NEW_BLOG',
        data: newBlog,
        })
        dispatch(setNotification(`Created a new blog ${newBlog.title} by ${newBlog.author}`, 'success'))
    } catch(exception) {
        dispatch(setNotification(`Error when creating a new blog`, 'danger'))
    }
  }
}

export const deleteBlog = (id) => {
    return async dispatch => {
        try {
            await blogService.remove(id)
            dispatch({
                type:'DELETE_BLOG',
                data: id
            })
            dispatch(setNotification(`Blog removed`, 'success'))
        } catch(exception) {
            dispatch(setNotification('Error when deleting blog', 'danger'))
        }
    }
}

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch({
      type: 'INIT_BLOGS',
      data: blogs.slice().sort(compareLikes)
    })
  }
}

export const addComment = (id, commentText) => {
  return async dispatch => {
    const commentObject = { comment: commentText, blog: id }
    const newComment = await blogService.addComment(id, commentObject)
    dispatch({
      type: 'ADD_COMMENT',
      data: newComment
    })
  }
}

export default blogReducer