import {useQuery} from "@tanstack/react-query"
import {getUser} from "../services/users.js"
import {useParams} from "react-router-dom"
import Blog from "./Blog.jsx"

const UserDetails = () => {
  const id = useParams().id
  const userQuery = useQuery({
    queryFn: () => getUser(id),
    queryKey: ['users', id]
  })

  return (
    <div>
      {
        userQuery.isLoading
          ? 'Loading user'
          : <div>
            <h2>{userQuery.data.name}</h2>
            <h4>added blogs</h4>
            <ul>
              {userQuery.data.blogs.map(b => <Blog key={b.id} blog={b} />)}
            </ul>
          </div>
      }
    </div>
  )
}

export default UserDetails
