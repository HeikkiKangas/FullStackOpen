import {useQuery} from "@tanstack/react-query"
import {getUsers} from "../services/users"
import {CircularProgress} from "@mui/material"
import User from "./User.jsx"

const UsersList = () => {
  const usersQuery = useQuery({
    queryFn: getUsers,
    queryKey: ['users']
  })

  if (usersQuery.isLoading) return <CircularProgress />
  return (
    <table>
      <thead>
        <tr>
          <th></th>
          <th>Blogs</th>
        </tr>
      </thead>
      <tbody>
      {usersQuery.data.map(u => <User key={u.id} user={u}>{JSON.stringify(u)}</User>)}
      </tbody>
    </table>
  )
}

export default UsersList
