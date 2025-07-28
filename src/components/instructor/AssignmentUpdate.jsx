import { useState, useRef } from 'react';
import { GRADEBOOK_URL } from '../../Constants';
import Messages from '../Messages';

const AssignmentUpdate = ({ editAssignment, onClose }) => {
  const [message, setMessage] = useState('');
  const [assignment, setAssignment] = useState({});
  const dialogRef = useRef();

  /*
   *  dialog for edit of an assignment
   */
  const editOpen = () => {
    setMessage('');
    setAssignment(editAssignment);
    dialogRef.current.showModal();
  };

  const dialogClose = () => {
    dialogRef.current.close();
    onClose();
  };

  const handleChange = (e) => {
    setAssignment({ ...assignment, [e.target.name]: e.target.value });
  };

  const onSave = async () => {
    if (!assignment.dueDate) {
      setMessage("Due date is required");
      return;
    }
    try {
      const body = {
        id:       assignment.id,
        title:    assignment.title,
        dueDate:  assignment.dueDate,
        courseId: assignment.courseId,
        secNo:    assignment.secNo,
        secId:    assignment.secId,
      };
      const response = await fetch(`${GRADEBOOK_URL}/assignments`, {
        method: 'PUT',
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
        <button id="editAssignmentButton" onClick={editOpen}>
          Edit
        </button>

        <dialog ref={dialogRef}>
          <h2>Edit Assignment</h2>
          <Messages response={message} />

          <p>ID: {assignment.id}</p>

          <input
              type="text"
              name="title"
              required
              placeholder="Title"
              value={assignment.title || ''}
              onChange={handleChange}
          />

          <input
              type="date"
              name="dueDate"
              required
              placeholder="Due Date"
              value={assignment.dueDate || ''}
              onChange={handleChange}
          />

          <button onClick={dialogClose}>Close</button>
          <button onClick={onSave}>Save</button>
        </dialog>
      </>
  );
}

export default AssignmentUpdate;
