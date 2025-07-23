import { useState, useRef } from "react";
import { REGISTRAR_URL } from "../../Constants";
import Messages from '../Messages';


//  dialog to edit user and change name, email, type

const UserUpdate = ({ onClose, editUser }) => {

  const [message, setMessage] = useState('');
  const [user, setUser] = useState({ id: "", name: "", email: "", type: "" });
  const dialogRef = useRef();


  const dialogOpen = () => {
    setMessage('');
    setUser(editUser);
    dialogRef.current.showModal();
  };

  const dialogClose = () => {
    dialogRef.current.close();
    onClose();
  };

  const editChange = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  const onSave = async () => {
    try {
      const response = await fetch(`${REGISTRAR_URL}/users`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": sessionStorage.getItem("jwt"),
        },
        body: JSON.stringify(user),
      });
      if (response.ok) {
        setMessage("user saved");
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err) {
      setMessage(err);
    }
  }

  return (
    <>
      <button onClick={dialogOpen}>Edit</button>
      <dialog ref={dialogRef}>
        <h2>Edit User</h2>
        <Messages response={message} />
        <input type="text" value={user.id} readOnly />
        <input type="text" name="name" value={user.name} placeholder="name" onChange={editChange} />
        <input type="email" name="email" value={user.email} placeholder="email" readOnly />
        <input type="text" name="type" value={user.type} placeholder="STUDENT, INSTRUCTOR or ADMIN" onChange={editChange} />
        <button onClick={dialogClose}>Close</button>
        <button onClick={onSave}>Save</button>
      </dialog>
    </>
  );
};

export default UserUpdate;
