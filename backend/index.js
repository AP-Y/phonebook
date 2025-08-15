// require('dotenv').config()

const express = require('express')
const app = express()
app.use(express.json())
app.use(express.static('dist'))

const morgan = require('morgan')

morgan.token('body', req => {
  return JSON.stringify(req.body)
})
const tiny = ":method :url :status :res[content-length] - :response-time ms"

app.use(morgan(`${tiny} :body`))

const Person = require('./models/person')

app.get('/info', (_request, response) => {
  Person.find({}).then(persons => {
    response.send(
      `<p>Phonebook has info for ${persons.length} people</p>
      <p>${new Date()}</p>`
    )
  })
})

app.get('/api/persons', (_request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
    .then(person => {
      response.json(person)
    })
    .catch(_error => {
      response.status(404).send({ error: 'person not found' })
    })
})

// CHECKME
app.post('/api/persons', (request, response) => {
  console.log("IN POST")
  const body = request.body
  console.log("GOT BODY")
  if (!(body.name && body.number)) {
    console.log("IN IF")
    return response.status(400).json({
      error: 'must include name and number'
    })
  }

  console.log("STARTING TO PRINT")
  const newPerson = new Person({
    name:   body.name,
    number: body.number,
  })

  newPerson.save().then(savedPerson => {
    response.json(savedPerson)
  })
})


app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then(_result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const PORT = 3001 // process.env.PORT
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})