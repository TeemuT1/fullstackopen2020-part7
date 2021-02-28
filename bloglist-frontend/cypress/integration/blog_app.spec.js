describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Super User',
      username: 'superuser',
      password: 'super'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Login')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('superuser')
      cy.get('#password').type('super')
      cy.get('#login-button').click()

      cy.contains('Login success')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('superuser')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.contains('Wrong credentials')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'superuser', password: 'super' })
    })

    it('A blog can be created', function() {
      cy.contains('New blog').click()
      cy.get('#newBlogTitle').type('A new blog')
      cy.get('#newBlogAuthor').type('Test Author')
      cy.get('#newBlogUrl').type('www.newblog.com')
      cy.get('#create-blog-button').click()
      cy.contains('A new blog')
      cy.contains('Test Author')
    })



    describe('and a blog exists', function() {
      beforeEach(function () {
        cy.createBlog({ title: 'First blog', author: 'Test Author', url: 'www.firstblog.com', likes: 1 })
        cy.createBlog({ title: 'Second blog', author: 'Test Author', url: 'www.secondblog.com', likes: 3 })
        cy.createBlog({ title: 'Third blog', author: 'Test Author', url: 'www.thirdblog.com', likes: 2 })
      })

      it('User can like a blog', function() {
        cy.contains('First blog').click()
        cy.contains('Likes: 1')
        cy.contains('like').click()
        cy.contains('Likes: 2')
      })

      it('User can delete a blog', function() {
        cy.contains('Second blog').click()
        cy.contains('remove').click()
        cy.contains('Blog removed')
        cy.contains('Second blog').should('not.exist')
      })

      it('Blogs are ordered by the number of likes', function() {
        cy.get('.blog').then(blogs => {
          cy.wrap(blogs[0]).should('contain', 'Second blog')
          cy.wrap(blogs[1]).should('contain', 'Third blog')
          cy.wrap(blogs[2]).should('contain', 'First blog')
        })

        cy.contains('Third blog').click()
        cy.get('.like-button').as('thirdBlogLikeButton')

        cy.get('@thirdBlogLikeButton').click()
        cy.get('.blog-likes').should('contain', 'Likes: 3')
        cy.get('@thirdBlogLikeButton').click()
        cy.get('.blog-likes').should('contain', 'Likes: 4')

        cy.get('#nav-link-blogs').click()
        

        cy.get('.blog').then(blogs => {
          cy.wrap(blogs[0]).should('contain', 'Third blog')
          cy.wrap(blogs[1]).should('contain', 'Second blog')
          cy.wrap(blogs[2]).should('contain', 'First blog')
        })
      })

      it('User can view how many blogs users have created', function() {
        cy.get('#nav-link-users').click()
        cy.get('.user-row').should('contain', 'Super User')
        cy.get('.user-row').should('contain', '3')
      })

      it('User can view list of blogs created by a user', function() {
        cy.get('#nav-link-users').click()
        cy.get('.user-link').click()
        cy.contains('First blog')
        cy.contains('Second blog')
        cy.contains('Third blog')
      })

    })
  })

})