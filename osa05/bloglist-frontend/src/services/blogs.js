import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const addBlog = ( token, title, author, url ) => {
  const request = axios
    .post(
      baseUrl,
      { title, author, url },
      { headers: { Authorization: `Bearer ${token}` } }
    )
  return request.then(response => response.data)
}

export default { getAll, addBlog }
