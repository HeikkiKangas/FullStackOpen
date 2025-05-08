const PORT = 3001

const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(express.json())
morgan.token('body', (req, res) => req.body ? JSON.stringify(req.body) : '')
app.use(morgan(':method :url :status :response-time ms :body'))

persons = [
  {
    id: 1,
    name: "esa ase",
    number: "050-1234567"
  },
  {
    id: 2,
    name: "ase esa",
    number: "050-1234568"
  },
  {
    id: 3,
    name: "asd das",
    number: "050-1234569"
  },
  {
    id: 4,
    name: "das asd",
    number: "050-1234560"
  },
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = +request.params.id
  const person = persons.find(p => p.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = +request.params.id
  const person = persons.find(p => p.id === id)

  if (person) {
    persons = persons.filter(p => p.id !== id)
    response.status(200).end()
  } else {
    response.status(404).end()
  }
})

app.post('/api/persons', (request, response) => {
  const generateId = () => Math.floor(Math.random() * 9999999)
  const entry = request.body
  
  if (!entry?.name || !entry?.number) {
    response.status(418).json({error: 'name and number are required'})
  } else if (persons.find(p => p.name === entry.name)) {
    response.status(418).json({error: 'name has to be unique'})
  } else {
    const data = {
      id: generateId(),
      name: entry.name,
      number: entry.number
    }

    persons = persons.concat(data)
    response.json(data)
  }
})

app.get('/info', (request, response) => {
  response.send(
    `Phonebook has info for ${persons.length} people\n${new Date().toString()}`)
})

const unknownEndpoint = (req, res, next) => {
  res.status(404).send({error: 'unknown endpoint'})
}
app.use(unknownEndpoint)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
