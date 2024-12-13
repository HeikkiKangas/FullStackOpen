/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import { getCountries } from './services/countries'

const App = () => {
  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])
  const [filter, setFilter] = useState('')
  useEffect(() => {
    const getInitialData = async () => {
      getCountries().then(countries => setCountries(countries))
    }
    getInitialData()
  }, [])

  const handleChange = (e) => setFilter(e.target.value)

  useEffect(() => setFilteredCountries(countries.filter(c => c.name.common.toLowerCase().includes(filter.toLowerCase()))), [filter])
  
  useEffect(() => console.log(countries), [countries])

  return(
    <div>
      find countries <input value={filter} onChange={handleChange} />
      {
        filteredCountries.length === 1
        ? filteredCountries.map(c => <SingleCountry key={c.name.common} country={c}/>)
        : (filteredCountries.length > 0 && filteredCountries.length < 11)
        ? filteredCountries.map(c => <CountryListItem key={c.name.common} country={c} setFilter={setFilter}/>)
        : filteredCountries.length > 10
          ? <p>Too many matches, specify another filter</p>
          : null
      }
    </div>
  )
}

const SingleCountry = ({ country }) =>
  <div>
    <h2>{country.name.common}</h2>
    <p>
      Capital: {country.capital.map(c => c)}
      <br/>
      Area: {country.area}
    </p>
    <h4>Languages:</h4>
    <ul>
      {Object.entries(country.languages).map(([k, v]) => <li key={k}>{v}</li>)}
    </ul>
    <img style={{ width: '20em', border: 'solid black 1px' }} src={country.flags.svg} alt={country.flags.alt}/>
  </div>

const CountryListItem = ({ country, setFilter }) => <p>{country.name.common} <button onClick={() => setFilter(country.name.common)}>show</button></p>

export default App
