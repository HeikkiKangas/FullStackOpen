const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <Course course={course} />
  )
}

const Course = ({course}) =>
  <div>
    <Header name={course.name} />
    <Content parts={course.parts} />
    <Total partsList={course.parts} />
  </div>

const Header = ({name}) =>
  <h1>{name}</h1>

const Content = ({parts}) =>
  <div>
    {parts.map((part, i) => <Part part={part} key={'part_' + i} />)}
  </div>

const Part = ({part}) =>
  <p>{part.name} {part.exercises}</p>

const Total = ({partsList}) =>
  <p>Number of exercises {partsList.reduce((sum, part) => sum + part.exercises, 0)}</p>


export default App
