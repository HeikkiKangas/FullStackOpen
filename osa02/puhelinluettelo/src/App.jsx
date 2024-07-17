import { useEffect, useState } from 'react'
import { getAllPersons, createPerson, deletePerson, updatePerson } from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => { getAllPersons().then(initialPersons => setPersons(initialPersons)) }, [])
  useEffect(() => console.log('persons', persons), [persons])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (persons.map(person => person.name).indexOf(newName) === -1) {
      createPerson({ name: newName, number: newNumber }).then(person => setPersons(persons.concat(person)))
      setNewName('')
      setNewNumber('')
    } else {
      if (confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const oldPerson = persons.find(p => p?.name === newName)
        updatePerson(oldPerson?.id, {...oldPerson, number: newNumber}).then(p => setPersons(persons.filter(person => person.id !== oldPerson.id).concat(p)))
        setNewName('')
        setNewNumber('')
      }
    }
  }
  
  return (
    <div>
      <h2>Phonebook</h2>
      <FilterForm filter={filter} setFilter={setFilter} />
      <AddPersonForm {...{newName, setNewName, newNumber, setNewNumber, handleSubmit}} />
      { persons ? <Persons persons={persons} setPersons={setPersons} filter={filter}/> : null }
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

const Persons = ({persons, filter, setPersons}) =>
  <>
  <h2>Numbers</h2>
  {persons?.filter(person => person?.name?.includes(filter)).map((person, i) => <Person key={'person_' + i} {...{ person, persons, setPersons }}/>)}
  </>

const Person = ({person, persons, setPersons}) => 
<>
<p>{person.name} {person.number} <button onClick={() => deletePerson(person.id).then(p => setPersons(persons.filter(pe => pe.id !== p.id)))}>delete</button></p>

</>

export default App
