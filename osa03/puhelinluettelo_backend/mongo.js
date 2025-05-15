const args = process.argv.slice(2)

if (args.length !== 1 && args.length !== 3) {
  console.log(`Expecting 1 or 3 arguments, ${args.length} given.`)
  process.exit(1)
}

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const [pw, name, number] = args
const url = `mongodb+srv://fullstack:${pw}@puhelinluettelo.dwtqlit.mongodb.net/?retryWrites=true&w=majority&appName=puhelinluettelo`
mongoose.connect(url)
  .then(res => {})
  .catch(e => console.log(`error connecting to MongoDB: ${e.message}`))

const personSchema = new mongoose.Schema({
  id: String,
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

const listPeople = () => {
  Person.find({})
    .then(res => {
      console.log('phonebook:')
      res.forEach(p => console.log(`${p.name} ${p.number}`))
      mongoose.connection.close()
    })
    .catch(e => console.log(`error: ${e.message}`))
}

const addPerson = (name, number) => new Person({ name, number }).save()
  .then(res => mongoose.connection.close())
  .catch(e => console.log(`error: ${e.message}`))

if (name && number) {
  addPerson(name, number)
} else {
  listPeople()
}
