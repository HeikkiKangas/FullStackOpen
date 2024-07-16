const Course = ({ course }) =>
  <div>
    <Header name={course.name} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />
  </div>

const Header = ({ name }) =>
  <h1>{name}</h1>

const Content = ({ parts }) =>
  <div>
    {parts.map((part, i) => <Part part={part} key={'part_' + i} />)}
  </div>

const Part = ({ part }) =>
  <p>{part.name} {part.exercises}</p>

const Total = ({ parts }) =>
  <p><b>total of {parts.reduce((sum, part) => sum + part.exercises, 0)} exercises</b></p>

export default Course
