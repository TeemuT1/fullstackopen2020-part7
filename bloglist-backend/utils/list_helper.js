const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const total = blogs.reduce((sum, blog) => {
    return sum + blog.likes
  },0)
  return total
}

const favoriteBlog = (blogs) => {
  let mostLikes = -1
  let favorite = {}
  blogs.forEach(blog => {
    if(blog.likes > mostLikes) {
      mostLikes = blog.likes
      favorite = blog
    }
  })
  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }
}

const mostBlogs = (blogsArr) => {
  if(!blogsArr || blogsArr.length === 0) {
    return {}
  }
  let blogs = []
  blogs = blogs.concat(blogsArr)

  let blogsByAuthor = []
  while (blogs.length > 0) {
    blogsByAuthor.push(_.remove(blogs, function(b, i, arr){return b.author === arr[0].author}))
  }
  const blogsOfMostProductive = _.maxBy(blogsByAuthor, 'length')
  return { 'author': blogsOfMostProductive[0].author, 'blogs': blogsOfMostProductive.length }
}

const mostLikes = (blogsArr) => {
  if(!blogsArr || blogsArr.length === 0) {
    return {}
  }
  let blogs = []
  blogs = blogs.concat(blogsArr)
  let blogsByAuthor = []
  let likesArr = []
  while (blogs.length > 0) {
    blogsByAuthor.push(_.remove(blogs, function(b, i, arr){return b.author === arr[0].author}))
  }
  blogsByAuthor.forEach((blogList) => {
    likesArr.push(
      { 'author': blogList[0].author, 'likes': _.sumBy(blogList, 'likes') })
  })
  const result = _.maxBy(likesArr, 'likes')
  return result
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}
