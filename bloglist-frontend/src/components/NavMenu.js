import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'

const NavMenu = ({ handleLogout }) => {
    const user = useSelector(state => state.user)

    return (
        <div>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link href="#" as="span">
                        <Link id="nav-link-blogs" to="/">Blogs</Link>
                    </Nav.Link>
                    <Nav.Link href="#" as="span">
                        <Link id="nav-link-users" to="/users">Users</Link>
                    </Nav.Link>
                    {user
                        ? 
                    (<><Nav.Link><em>{user.name} logged in</em></Nav.Link> 
                    <Button variant="primary" onClick={ handleLogout }>
                        Log out
                    </Button>
                    </>)
                        : 
                    (<><Nav.Link href="#" as="span">
                        <Link to="/login">login</Link>
                    </Nav.Link>
                    </>)
                    }
                    
                </Nav>
            </Navbar.Collapse>
        </Navbar>

      </div>
    )

}

export default NavMenu