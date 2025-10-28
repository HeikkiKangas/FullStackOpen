import {Link} from "react-router-dom"
import {Container} from "@mui/material"

const Navbar = () =>
  <Container>
    <Link to='/'>Blogs</Link>
    <Link style={{marginLeft: '0.5rem'}} to='/users'>Users</Link>
  </Container>

export default Navbar
