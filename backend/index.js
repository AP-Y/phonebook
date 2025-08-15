require('dotenv').config()

const express = require('express')
const app = express()
app.use(express.static('dist'))
app.use(express.json())

const morgan = require('morgan')

morgan.token('body', req => {
  return JSON.stringify(req.body)
})
const tiny = ":method :url :status :res[content-length] - :response-time ms"

app.use(morgan(`${tiny} :body`))

const Person = require('./models/person')

app.get('/info', (_request, response, next) => {
  Person.find({})
    .then(persons => {
      response.send(
        `<p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>`
      )
    })
    .catch(error => next(error))
})

app.get('/api/persons', (_request, response, next) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!(body.name && body.number)) {
    return response.status(400).json({
      error: 'must include name and number'
    })
  }

  const newPerson = new Person({
    name:   body.name,
    number: body.number,
  })

  newPerson.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        person.name = name
        person.number = number

        return person.save().then(updatedPerson => {
          response.json(updatedPerson)
        })
      } else {
        response.status(404).send({ error: 'this person does not exit to update' })
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(_result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const unknownEndpoint = (_request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, _request, response, next) => {
  console.log(error)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})