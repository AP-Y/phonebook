const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = "mongodb+srv://aarnapy:vEdmbvfsuk0G86Zs@cluster0.wjzgkvg.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0" // process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url)
  .then(_result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

personSchema.set('toJSON', {
  transform: (_document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString()
    delete returnedObj._id
    delete returnedObj.__v
  }
})

module.exports = mongoose.model('Person', personSchema)