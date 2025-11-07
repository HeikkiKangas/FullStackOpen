import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS } from '../queries.js'
import _ from 'lodash'
import { useEffect, useState } from 'react'

const Books = (props) => {
  const [genreFilter, setGenreFilter] = useState(null)

  const books = useQuery(ALL_BOOKS, { skip: !props.show })

  if (!props.show) return null

  if (books.loading) return <div>Loading books...</div>

  return (
    <div>
      <h2>{genreFilter ? genreFilter : 'all'} books</h2>
      {
        books?.data?.allBooks &&
        <div>
          <table>
            <tbody>
              <tr>
                <th></th>
                <th>author</th>
                <th>published</th>
              </tr>
              {books?.data?.allBooks.filter(a => genreFilter ? a.genres.includes(genreFilter) : true).map((a) => (
                <tr key={a.title}>
                  <td>{a.title}</td>
                  <td>{a.author.name}</td>
                  <td>{a.published}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {_.uniq(
            books?.data?.allBooks?.reduce((result, book) => [...result, ...book.genres], [])
          ).map(genre => <button key={genre} onClick={() => setGenreFilter(genre)}>{genre}</button>)}
          <button onClick={() => setGenreFilter(null)}>all genres</button>
        </div>
      }
    </div>
  )
}
//
export default Books
