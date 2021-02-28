import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
const Users = () => {

    const users = useSelector(state => state.users)
    return (
    <div>
    <h2>Users</h2>
    <table>
      <tbody>
        <tr>
            <td>User</td>
            <td>blogs created</td>
        </tr>
        {users.map(user => (
          <tr className="user-row" key={user.id}>
            <td>
            <Link className="user-link" to={`/users/${user.id}`}>{user.name}</Link>
            </td>
            <td>
              {user.blogs.length}
            </td>
          </tr>
          )
        )}
      </tbody>
    </table>
  </div>
)
}
export default Users