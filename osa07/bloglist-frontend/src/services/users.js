import axios from 'axios'
const baseUrl = '/api/users'

export const getUsers = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}


export const getUser = (id) => {
  const request = axios.get(`/api/users/${id}`)
  return request.then(response => response.data)
}
