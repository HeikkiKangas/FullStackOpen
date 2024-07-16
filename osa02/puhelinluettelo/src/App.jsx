import axios from 'axios'
import { useEffect, useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([])
  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(res => setPersons(res.data))
  }, [])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (persons.map(person => person.name).indexOf(newName) === -1) {
      setPersons(persons.concat({name: newName, number: newNumber}))
      setNewName('')
      setNewNumber('')
    } else {
      alert(`${newName} is already added to phonebook`)
    }
  }
  
  return (
    <div>
      <h2>Phonebook</h2>
      <FilterForm filter={filter} setFilter={setFilter} />
      <AddPersonForm {...{newName, setNewName, newNumber, setNewNumber, handleSubmit}} />
      <Persons persons={persons} filter={filter}/>
    </div>
  )

}

const FilterForm = ({filter, setFilter}) => <>filter shown with <input value={filter} onChange={e => setFilter(e.target.value)} /></>

const AddPersonForm = ({newName, setNewName, newNumber, setNewNumber, handleSubmit}) =>
  <>
  <h2>add a new</h2>
  <form onSubmit={handleSubmit}>
    <div>
      name: <input value={newName} onChange={e => setNewName(e.target.value)}/>
      <br/>
      number: <input value={newNumber} onChange={e => setNewNumber(e.target.value)}/>
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
  </>

const Persons = ({persons, filter}) =>
  <>
  <h2>Numbers</h2>
  {persons.filter(person => person.name.includes(filter)).map((person, i) => <Person key={'person_' + i} person={person}/>)}
  </>

const Person = ({person}) => <p>{person.name} {person.number}</p>

export default App
