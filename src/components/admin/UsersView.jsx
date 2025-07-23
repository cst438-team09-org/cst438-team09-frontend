import { useState, useEffect } from "react";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import UserUpdate from "./UserUpdate";
import UserAdd from "./UserAdd";
import { REGISTRAR_URL } from "../../Constants";
import Messages from '../Messages';

// list all users with links to edit, delete each user
//  button to add new user

function UsersView() {

  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${REGISTRAR_URL}/users`,
        {
          method: "GET",
          headers: {
            "Authorization": sessionStorage.getItem("jwt"),
          }
        }
      );
      if (response.ok) {
        const users = await response.json();
        setUsers(users);
        setMessage('');
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err) {
      setMessage(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);



  const deleteUser = async (id) => {
    try {
      const response = await fetch(`${REGISTRAR_URL}/users/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": sessionStorage.getItem("jwt"),
        },
      });
      if (response.ok) {
        setMessage("User deleted");
        fetchUsers();
      } else {
        const body = await response.json();
        setMessage(getMessageDetails(body));
      }
    } catch (err) {
      setMessage(err);
    }
  };

  const onDelete = (id) => {
    confirmAlert({
      title: "Confirm to delete",
      message: "Do you really want to delete?",
      buttons: [
        {
          label: "Yes",
          onClick: () => deleteUser(id),
        },
        {
          label: "No",
        },
      ],
    });
  };

  const headers = ["ID", "Name", "Email", "Type", "", ""];

  return (
    <>
      <h3>Users</h3>
      <Messages response={message} />
      <table className="Center">
        <thead>
          <tr>
            {headers.map((s, idx) => (
              <th key={idx}>{s}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.type}</td>
              <td><UserUpdate editUser={user} onClose={fetchUsers} /></td>
              <td><button onClick={() => onDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <UserAdd onClose={fetchUsers} />
    </>
  );
}
export default UsersView;
