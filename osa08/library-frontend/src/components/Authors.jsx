import { useMutation, useQuery } from '@apollo/client/react'
import { ALL_AUTHORS, ALL_BOOKS, EDIT_BORN } from '../queries.js'
import { useState } from 'react'


const Authors = (props) => {
  const authors = useQuery(ALL_AUTHORS, { skip: !props.show })
  const [name, setName] = useState(authors?.data ? authors.data.allAuthors[0].name : '')
  const [born, setBorn] = useState('')
  const [editBorn] = useMutation(EDIT_BORN, { refetchQueries: [ALL_AUTHORS] })

  if (!props.show) {
    return null
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(name, born)
    editBorn({
      variables: {
        name,
        setBornTo: Number(born)
      }
    }).then(() => setBorn(''))
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors?.data && authors?.data?.allAuthors?.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>set birthyear</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            author
            <select value={name} onChange={e => setName(e.target.value)}>
              {authors?.data && authors?.data?.allAuthors.map(a => <option key={a.name} value={a.name}>{a.name}</option>)}
            </select>
          </label>
        </div>
        <div>
          <label>
            born
            <input type='number' value={born} onChange={e => setBorn(e.target.value)}/>
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default Authors
