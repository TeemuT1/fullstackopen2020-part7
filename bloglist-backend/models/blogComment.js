const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

const blogCommentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true
  },
  blog: {
    type:mongoose.Schema.Types.ObjectId,
    ref: 'Blog'
  }
})

blogCommentSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('BlogComment', blogCommentSchema)