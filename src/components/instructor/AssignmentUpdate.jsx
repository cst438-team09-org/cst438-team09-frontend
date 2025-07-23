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
    // to be implemented.  invoke showModal() method on the dialog element.
    // dialogRef.current.showModal();
  };



  return (
    <>
      <button onClick={editOpen}>Edit</button>
      <dialog ref={dialogRef} >
        <p>To be implemented.  Show the id, title and due date of the assignemnt.
          Allow user to edit the title and due date.
          Buttons for Close and Save.
        </p>
      </dialog>
    </>
  )
}

export default AssignmentUpdate;
