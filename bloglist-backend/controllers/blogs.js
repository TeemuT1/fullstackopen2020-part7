const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const BlogComment = require('../models/blogComment')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response, next) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
    .populate('comments', { comment: 1, blog: 1 })
  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.get('/:id', async (request, response, next) => {
  const blog = await Blog
    .findById(request.params.id)
    .populate('user', { username: 1, name: 1 })
    .populate('comments', { comment: 1, blog: 1 })
  response.json(blog.toJSON())
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body

  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.post('/:id/comments', async (request, response, next) => {
  const body = request.body
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = await Blog.findById(request.params.id)

  const blogComment = new BlogComment(body)

  const savedBlogComment = await blogComment.save()
  blog.comments = blog.comments.concat(savedBlogComment._id)
  await blog.save()
  response.json(savedBlogComment)
})

blogsRouter.get('/:id/comments', async (request, response, next) => {
  const blog = await Blog
    .findById(request.params.id).populate('user', { username: 1, name: 1 })
  response.json(blog.toJSON())
})

blogsRouter.put('/:id', async (request, response, next) => {
  const blog = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog.toJSON())
})

blogsRouter.delete('/:id', async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)
  const blogToBeDeleted = await Blog.findById(request.params.id)
  if (!blogToBeDeleted) {
    return response.status(404).json( { error: 'blog already deleted' })
  }

  if(blogToBeDeleted.user.toString() === decodedToken.id) {
    await blogToBeDeleted.remove()
    user.blogs = user.blogs.filter(blog => blog.id.toString() !== request.params.id.toString())
    await user.save()
    response.status(204).end()
  } else {
    return response.status(401).json({ error: 'not the owner of this blog' })
  }
})

module.exports = blogsRouter