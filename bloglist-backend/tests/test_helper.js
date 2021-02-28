const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs =  [
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: 'New Stuff',
    author: 'Smart Guy',
    url: 'http://www.example.com',
    likes: 3,
  },
  {
    title: 'Newer Stuff',
    author: 'Smartest Guy',
    url: 'http://www.example2.com',
    likes: 7,
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  blogsInDb, usersInDb, initialBlogs
}