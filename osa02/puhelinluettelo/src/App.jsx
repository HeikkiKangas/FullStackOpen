/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import { getAllPersons, createPerson, deletePerson, updatePerson } from './services/persons'
import './App.css'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [msgStyle, setMsgStyle] = useState(null)

  useEffect(() => { getAllPersons().then(initialPersons => setPersons(initialPersons)) }, [])
  useEffect(() => console.log('persons', persons), [persons])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (persons.map(person => person.name).indexOf(newName) === -1) {
      createPerson({ name: newName, number: newNumber }).then(person => {
        setPersons(persons.concat(person))
        console.log('createPerson', person)
      }).then(() => {
        setMessage(`Added "${newName}"`)
        setMsgStyle('message')
        setTimeout(() => setMessage(null), 5000)
        setNewName('')
        setNewNumber('')
      }).catch( e => {
        console.log(e.response.data)
        setMessage(`Could not add "${newName}": ${e.response.data}`)
        setMsgStyle('error')
        setTimeout(() => setMessage(null), 5000)
      })
    } else {
      if (confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const oldPerson = persons.find(p => p?.name === newName)
        updatePerson(oldPerson?.id, {...oldPerson, number: newNumber}).then(p => {
          setPersons(persons.filter(person => person.id !== oldPerson.id).concat(p))
          console.log('updatePerson', p)
        }).then(() => {
          setMessage(`Updated "${newName}"`)
          setMsgStyle('message')
          setTimeout(() => setMessage(null), 5000)
          setNewName('')
          setNewNumber('')
        }).catch( e => {
          setMessage(`Could not update "${newName}": ${e.message}`)
          setMsgStyle('error')
          setTimeout(() => setMessage(null), 5000)
        })
      }
    }
  }
  
  return (
    <div>
      <h2>Phonebook</h2>
      <MessageBox {...{message, msgStyle}}/>
      <FilterForm filter={filter} setFilter={setFilter} />
      <AddPersonForm {...{newName, setNewName, newNumber, setNewNumber, handleSubmit}} />
      { persons ? <Persons {...{persons, setPersons, filter, setMessage, setMsgStyle}} /> : null }
    </div>
  )

}

const MessageBox = ({ message, msgStyle }) =>
  message === null
    ? null
    : <div className={msgStyle === 'message' ? 'message' : 'error'}>
        <h3>{message}</h3>
      </div>

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

const Persons = ({persons, filter, setPersons, setMessage, setMsgStyle}) =>
  <>
  <h2>Numbers</h2>
  {persons?.filter(person => person?.name?.includes(filter)).map((person, i) => <Person key={'person_' + i} {...{ person, persons, setPersons, setMessage, setMsgStyle }}/>)}
  </>

const Person = ({person, persons, setPersons, setMessage, setMsgStyle}) => 
<>
<p>{person.name} {person.number} <button onClick={() => {
  if (window.confirm(`Delete ${person.name}?`)) {
    deletePerson(person.id)
    .then(p => {
      setPersons(persons.filter(pe => pe.id !== person.id))
      setMessage(`Deleted "${person.name}"`)
      setMsgStyle('message')
      setTimeout(() => setMessage(null), 5000)
      console.log('deletePerson', p)
      }).catch( e => {
        setMessage(`Could not delete "${person.name}": ${e.message}`)
        setMsgStyle('error')
        setTimeout(() => setMessage(null), 5000)
      })
  }
}
    }>
    delete
  </button></p>

</>



export default App
