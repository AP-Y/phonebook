const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://aarnapy:${password}@cluster0.wjzgkvg.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  // Display all persons
  Person.find({}).then(result => {
    result.forEach(per => {
      console.log(per)
    })
    mongoose.connection.close()
  })

} else if (process.argv.length === 5) {
  // Add person
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name:   name,   // "John",
    number: number, // "1234",
  })

  person.save().then(result => {
    console.log(`${name} at ${number} has been added to phonebook`)
    mongoose.connection.close()
  })

} else {
  console.log('usage:\tnode mongo.js [password] [name] [number]\n\tnode mongo.js [password]')
  mongoose.connection.close()
}