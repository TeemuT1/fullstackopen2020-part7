const listHelper = require('../utils/list_helper')

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 8,
    __v: 0
  }
]

const listWithSeveralBlogs = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 8,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f7',
    title: 'New Stuff',
    author: 'Smart Guy',
    url: 'http://www.example.com',
    likes: 3,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f6',
    title: 'Newer Stuff',
    author: 'Smart Guy',
    url: 'http://www.example2.com',
    likes: 7,
    __v: 0
  }
]

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(8)
  })

  test('when the list has several blogs, the result is the total likes of all of them', () => {
    const result = listHelper.totalLikes(listWithSeveralBlogs)
    expect(result).toBe(18)
  })

  test('when the list is empty, return 0', () => {
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
  })
})

describe('favorite blog', () => {

  test('when the list has only one blog, it will return info about that one', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    expect(result).toEqual({
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 8
    })
  })

  test('when the list has several blogs, it will return info about the one with most likes', () => {
    const result = listHelper.favoriteBlog(listWithSeveralBlogs)
    expect(result).toEqual({
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 8
    })
  })

  test('when the list is empty, return empty object', () => {
    const result = listHelper.favoriteBlog([])
    expect(result).toEqual({
    })
  })

})

describe('mostBlogs', () => {

  test('return the author with most blogs and the number of blogs', () => {
    const result = listHelper.mostBlogs(listWithSeveralBlogs)
    expect(result).toEqual({
      author: 'Smart Guy',
      blogs: 2
    })
  })

  test('when the list is empty, mostBlogs returns an empty object', () => {
    const result = listHelper.mostBlogs([])
    expect(result).toEqual({
    })
  })

})

describe('mostLikes', () => {
  test('return the author with most likes and the number of likes', () => {
    const result = listHelper.mostLikes(listWithSeveralBlogs)
    expect(result).toEqual({
      author: 'Smart Guy',
      likes: 10
    })
  })

  test('when the list is empty, mostLikes returns an empty object', () => {
    const result = listHelper.mostLikes([])
    expect(result).toEqual({
    })
  })

})