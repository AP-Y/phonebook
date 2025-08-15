require('dotenv').config()

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

console.log(typeof Person)

app.get('/info', (_request, response) => {
  console.log("--- GET /info")
  const numPersons = Person.find({}).then(persons => persons.length)

  response.send(
    `<p>Phonebook has info for ${numPersons} people</p>
    <p>${new Date()}</p>`
  )
})

app.get('/api/persons', (_request, response) => {
  console.log("--- GET /api/persons")

  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  console.log("--- GET /api/persons/:id")

  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

app.post('/api/persons', (request, response) => {
  console.log("--- POST /api/persons")

  const body = request.body
  const allNames = Person.find({}).then(persons => {
    persons.map(per => per.name.toLowerCase())
  })

  if (!(body.name && body.number)) {
    return response.status(400).json({
      error: 'must include name and number'
    })
  } else if (allNames.includes(body.name.toLowerCase())) {
    return response.status(400).json({
      error: 'name already included in phonebook'
    })
  }

  const newPerson = new Person({
    name:   body.name,
    number: body.number,
  })

  newPerson.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

app.delete('/api/persons/:id', (request, response) => {
  console.log("--- DELETE /api/persons/:id")

  Person.findByIdAndDelete(request.params.id)
    .then(_result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})