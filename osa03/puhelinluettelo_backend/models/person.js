const url = process.env.MONGODB_URI

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
console.log(`MongoDB connecting to ${url}`)
mongoose.connect(url)
    .then(res => console.log('connected to MongoDB'))
    .catch(e => console.log(`error connecting to MongoDB: ${e.message}`))

const personSchema = new mongoose.Schema({
  id: String,
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    required: true
  }
})

personSchema.set('toJSON', {
  transform: (doc, obj) => {
    obj.id = obj._id.toString()
    delete obj._id
    delete obj.__v
  }
})

module.exports = mongoose.model('Person', personSchema)