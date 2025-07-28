import {useState, useRef} from 'react';
import {GRADEBOOK_URL} from '../../Constants';
import Messages from '../Messages';

const AssignmentAdd = ({onClose, secNo, secId, courseId}) => {

    const [message, setMessage] = useState('');
    const [assignment, setAssignment] = useState({title: '', dueDate: ''});
    const dialogRef = useRef();

    /*
     *  dialog for add assignment
     */
    const editOpen = () => {
        setMessage('');
        setAssignment({title: "", dueDate: "", secNo: secNo});
        dialogRef.current.showModal();
    };

    const dialogClose = () => {
        dialogRef.current.close();
        onClose();
    };

    const editChange = (event) => {
        setAssignment({...assignment, [event.target.name]: event.target.value});
    };

    const onSave = async () => {
        if (!assignment.dueDate) {
            setMessage("Due date is required");
            return;
        }
        try {
            const body = {
                title: assignment.title,
                dueDate: assignment.dueDate === '' ? null : assignment.dueDate,
                secNo,
                secId,
                courseId,
            };
            const response = await fetch(`${GRADEBOOK_URL}/assignments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: sessionStorage.getItem('jwt'),
                },
                body: JSON.stringify(body),
            });
            if (response.ok) {
                dialogClose();
            } else {
                const body = await response.json();
                setMessage(body);
            }
        } catch (err) {
            setMessage(err.toString());
        }
    };

    return (
        <>
            <button id="addAssignmentButton" onClick={editOpen}>
                Add Assignment
            </button>
            <dialog ref={dialogRef}>
                <h2>Add Assignment</h2>
                <Messages response={message}/>
                <input
                    type="text"
                    name="title"
                    placeholder='Title'
                    value={assignment.title}
                    onChange={editChange}
                />
                <input
                    type="date"
                    name="dueDate"
                    placeholder='Due Date'
                    value={assignment.dueDate}
                    onChange={editChange}
                />
                <button onClick={dialogClose}>Close</button>
                <button onClick={onSave}>Save</button>
            </dialog>
        </>
    );
};

export default AssignmentAdd;
