import {Link} from "react-router-dom"
import {Paper} from "@mui/material"

const blogStyle = {
  border: "2px solid black",
  borderRadius: "0.5rem",
  padding: "0.5rem",
  marginBottom: "0.5rem"
}

const Blog = ({ blog }) =>
  <Paper style={{ marginBottom: '0.5rem', padding: '0.5rem' }} variant='outlined' key={blog.id}>
    <Link to={'/blogs/' + blog.id}>
      { blog.title }
    </Link>
  </Paper>

export default Blog
