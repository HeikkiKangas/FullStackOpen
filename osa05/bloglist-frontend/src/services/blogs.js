import axios from 'axios'

const baseUrl = '/api/blogs'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const getBlog = (id) => {
  const request = axios.get(`/api/blogs/${id}`)
  return request.then(response => response.data)
}

const addBlog = (token, title, author, url) => {
  const request = axios
    .post(
      baseUrl,
      { title, author, url },
      { headers: { Authorization: `Bearer ${token}` } }
    )
  return request.then(response => response.data)
}

export const updateBlog = (token, updatedBlog) => {
  const request = axios
    .put(
      `${baseUrl}/${updatedBlog.id}`,
      updatedBlog,
      { headers: { Authorization: `Bearer ${token}` } }
    )
  return request.then(response => response.data)
}

export const deleteBlog = (token, id) => {
  const request = axios
    .delete(
      `${baseUrl}/${id}`,
      { headers: { Authorization: `Bearer ${ token }` } }
    )
  return request.then(response => response.data)
}

export default { getAll, getBlog, addBlog, updateBlog, deleteBlog }
