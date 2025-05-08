import axios from "axios"
const baseUrl = '/api/persons'

const getAllPersons = () =>
  axios.get(baseUrl).then(res => res.data)

const createPerson = person =>
  axios.post(baseUrl, person).then(res => res.data)

const deletePerson = id =>
  axios.delete(`${baseUrl}/${id}`).then(res => res.data)

const updatePerson = (id, person) =>
  axios.put(`${baseUrl}/${id}`, person).then(res => res.data)

export { 
  getAllPersons, 
  createPerson, 
  deletePerson, 
  updatePerson
}
