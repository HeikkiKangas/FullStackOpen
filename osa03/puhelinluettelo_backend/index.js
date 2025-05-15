require('dotenv').config()

const PORT = process.env.PORT

const express = require('express')
const Person = require('./models/person')
const app = express()
const morgan = require('morgan')

app.use(express.json())
app.use(express.static('dist'))
morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :response-time ms :body'))

app.get('/api/persons', (request, response) => {
  Person.find({}).then(res => response.json(res))
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  Person.findById(id)
    .then(person => {
      if (!person) {
        response.status(404).end()
      }
      response.json(person)
    })
    .catch(e => response.status(400).send({ error: "malformed id" }))
})

app.delete('/api/persons/:id', (request, response, next) => {
  const _id = request.params.id
  Person.deleteOne({ _id })
    .then(res => {
      if (res.deletedCount) {
        response.status(200).end()
      } else {
        response.status(404).end()
      }
    })
    .catch(e => next(e))
})

app.post('/api/persons', (request, response, next) => {
  const entry = request.body

  if (!entry) {
    return response.status(400).json({ error: 'content missing' })
  } else if (!entry?.name || !entry?.number) {
    response.status(418).json({ error: 'name and number are required' })
  } else {
    Person.find({ name: entry.name })
      .then(res => {
        if (res.length) {
          response.status(418).json({ error: 'name has to be unique' })
        } else {
          const data = {
            name: entry.name,
            number: entry.number
          }

          new Person(data).save().then(res => response.json(res)).catch(e => next(e))
        }
      })
      .catch(e => next(e))
  }
})

app.put('/api/persons/:id', (req, res, next) => {
  const { number } = req.body
  Person.findById(req.params.id)
    .then(person => {
      if (!person) {
        return res.status(404).end()
      }

      person.number = number
      person.save().then(updatedPerson => res.json(updatedPerson)).catch(e => next(e))

    })
    .catch(e => next(e))
})

app.get('/info', (request, response, next) => {
  Person.find({})
    .then(res => response.send(`Phonebook has info for ${res.length} people\n${new Date().toString()}`))
    .catch(e => next(e))
})

const unknownEndpoint = (req, res, next) => {
  res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const ErrorHandler = (error, req, res, next) => {
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformed id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(ErrorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
