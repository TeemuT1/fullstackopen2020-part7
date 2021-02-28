import React from 'react'
import Table from 'react-bootstrap/Table'
import { Link } from 'react-router-dom'
const User = ({ user }) => {
    if (!user) {
        return null
    }
    return (
      <div>
        <h2>Blogs created by {user.name}:</h2>
        <Table striped>
          <tbody>
        
          { user.blogs.map(blog => 
              <tr>
                <td  key={blog.id}>                           
                  <Link to={`/blogs/${blog.id}`}> 
                    {blog.title}
                  </Link>
                </td>  
              </tr>
          )}
          </tbody>
        </Table>
      </div>
    )
}
export default User