import axios from "axios"
const baseUrl = 'http://api.weatherapi.com/v1/current.json'
const apiKey = import.meta.env.VITE_WEATHER_API_KEY

const getWeather = (city) =>
    axios.get(`${baseUrl}?key=${apiKey}&q=${city}`).then(res => res.data)

export {
    getWeather
}
