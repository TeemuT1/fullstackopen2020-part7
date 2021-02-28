const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

jest.setTimeout(30000)

let testUser
let testUserToken

beforeEach(async () => {
  await Blog.deleteMany({})

  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[2])
  await blogObject.save()

  await User.deleteMany({})

  const newUser = {
    name: 'Tester Tim',
    username: 'tester',
    password: 'test'
  }

  await api
    .post('/api/users')
    .send(newUser)
  testUser = await User.findOne({ 'username': 'tester' })
  const loginResult = await api
    .post('/api/login')
    .send(newUser)
  testUserToken = loginResult.body.token

})

describe('get blogs', () => {

  test('three initially saved blogs are returned as json', async () => {
    const resultBlogs = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(resultBlogs.body).toHaveLength(helper.initialBlogs.length)
  })

  test('unique identifier property of blogs is named "id"', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body[0].id).toBeDefined()
  })

})

describe('add blogs', () => {

  test('a valid blog can be added ', async () => {
    const newBlog = {
      title: 'Test blog',
      author: 'Tester Tom',
      url: 'http://www.testexample.com',
      likes: 2,
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${testUserToken}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).toContain(
      'Test blog'
    )
  })

  test('missing likes property defaults to 0', async () => {
    const newBlog = {
      title: 'Test blog without likes',
      author: 'Tester Tim',
      url: 'http://www.testexamples.com',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${testUserToken}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)

    const likes = blogsAtEnd.map(b => b.likes)
    expect(likes).toContain(0)
  })

  test('no author and no url gets response 400', async () => {
    const newBlog = {
      author: 'No Title No Url',
      likes: 4
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${testUserToken}`)
      .expect(400)
  })

  test('invalid token returns status code 401', async () => {
    const newBlog = {
      title: 'Cannot add blogs with invalid tokens',
      author: 'Bad Hacker',
      url: 'www.hacker.com',
      likes: 2
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', 'bearer sdfafklg')
      .expect(401)
  })
})

describe('delete blogs', () => {

  test('deleting a blog works', async () => {

    const blogObject = new Blog(
      {
        title: 'Tester Tim test blog',
        author: 'Tester Tim',
        url: 'http://www.example5.com',
        likes: 6,
        user: testUser._id
      })
    await blogObject.save()

    const blogsAtStart = await helper.blogsInDb()
    expect(blogsAtStart.length).toBe(
      helper.initialBlogs.length + 1
    )

    const blogToDelete = blogsAtStart[3]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `bearer ${testUserToken}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toBe(
      helper.initialBlogs.length
    )
    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).not.toContain(blogToDelete.title)
  })
})

describe('update blogs', () => {
  test('updating a blog works', async () => {

    const blogsAtStart = await helper.blogsInDb()
    const blogToEdit = blogsAtStart[0]

    const blog = {
      title: blogToEdit.title,
      author: blogToEdit.author,
      url: blogToEdit.author,
      likes: 99
    }

    await api
      .put(`/api/blogs/${blogToEdit.id}`)
      .send(blog)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()

    const likes = blogsAtEnd.map(b => b.likes)
    expect(likes).toContain(blog.likes)
  })
})

afterAll(() => {
  mongoose.connection.close()
})