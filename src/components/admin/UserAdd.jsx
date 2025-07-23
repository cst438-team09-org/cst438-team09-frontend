import { useState, useRef } from 'react';
import { REGISTRAR_URL } from '../../Constants';
import Messages from '../Messages';

// dialog to add user

const UserAdd = ({ onClose }) => {

    const [message, setMessage] = useState('');
    const [user, setUser] = useState({ name: '', email: '', type: '' });
    const dialogRef = useRef();

    const dialogOpen = () => {
        setMessage('');
        setUser({ name: '', email: '', type: '' });
        dialogRef.current.showModal();

    };

    const dialogClose = () => {
        dialogRef.current.close();
        onClose();
    };

    const editChange = (event) => {
        setUser({ ...user, [event.target.name]: event.target.value })
    }

    const onSave = async () => {
        try {
            const response = await fetch(`${REGISTRAR_URL}/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": sessionStorage.getItem("jwt"),
                },
                body: JSON.stringify(user),
            });
            if (response.ok) {
                const newuser = await response.json();
                setMessage("User added id=" + newuser.id);
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
            <button onClick={dialogOpen}>Add User</button>
            <dialog ref={dialogRef} >
                <h2>Add User</h2>
                <Messages response={message} />
                <input type="text" name="name" value={user.name} placeholder="name" onChange={editChange} />
                <input type="email" name="email" value={user.email} placeholder="email" onChange={editChange} />
                <input type="text" name="type" value={user.type} placeholder="STUDENT, INSTRUCTOR or ADMIN" onChange={editChange} />
                <button onClick={dialogClose}>Close</button>
                <button onClick={onSave}>Save</button>
            </dialog >
        </>
    )
}

export default UserAdd;