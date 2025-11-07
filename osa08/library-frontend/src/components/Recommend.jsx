import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS, ME } from '../queries.js'

const Recommend = (props) => {
  const booksQuery = useQuery(ALL_BOOKS, { skip: !props.show })
  if (!props.show) return null
  if (booksQuery.loading) return <div>Loading books...</div>
  return (
    <div>
      <h2>{props.favoriteGenre} recommendations</h2>
      <div>
        <table>
          <tbody>
            <tr>
              <th/>
              <th>author</th>
              <th>published</th>
            </tr>
            {
              booksQuery?.data?.allBooks.filter(a => a.genres.includes(props.favoriteGenre)).map((a) => (
                <tr key={a.title}>
                  <td>{a.title}</td>
                  <td>{a.author.name}</td>
                  <td>{a.published}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Recommend
