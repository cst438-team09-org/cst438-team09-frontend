import { useState, useRef } from "react";
import { REGISTRAR_URL } from "../../Constants";
import Messages from '../Messages';

/*
 * Dialog for adding a section
 */

const SectionAdd = ({ onClose }) => {

  const [message, setMessage] = useState("");
  const [section, setSection] = useState({ courseId: "", secId: "", year: "", semester: "", building: "", room: "", times: "", instructorEmail: "", });
  const dialogRef = useRef();

  const dialogOpen = () => {
    setSection({ courseId: "", secId: "", year: "", semester: "", building: "", room: "", times: "", instructorEmail: "", });
    setMessage("");
    dialogRef.current.showModal();
  };

  const dialogClose = () => {
    dialogRef.current.close();
    onClose();
  };

  const editChange = (event) => {
    setSection({ ...section, [event.target.name]: event.target.value });
  };

  const onSave = async () => {
    try {
      const response = await fetch(`${REGISTRAR_URL}/sections`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": sessionStorage.getItem("jwt"),
        },
        body: JSON.stringify(section),
      });
      if (response.ok) {
        const rc = await response.json();
        setMessage("section added secno=" + rc.secNo);
      } else {
        const rc = await response.json();
        setMessage(rc.message);
      }
    }
    catch (err) {
      setMessage(err);
    }
  }

  return (
    <div>
      <button onClick={dialogOpen}>Add Section</button>
      <dialog ref={dialogRef}>
        <h2>Add Section</h2>
        <Messages response={message} />
        <input type="text" name="courseId" value={section.courseId} placeholder="course id" onChange={editChange} />
        <input type="text" name="secId" value={section.secId} placeholder="section id" onChange={editChange} />
        <input type="text" name="year" value={section.year} placeholder="year" onChange={editChange} />
        <input type="text" name="semester" value={section.semester} placeholder="semester" onChange={editChange} />
        <input type="text" name="building" value={section.building} placeholder="building" onChange={editChange} />
        <input type="text" name="room" value={section.room} placeholder="room" onChange={editChange} />
        <input type="text" name="times" value={section.times} placeholder="times" onChange={editChange} />
        <input type="email" name="instructorEmail" value={section.instructorEmail} placeholder="instructor email" onChange={editChange} />
        <button id="close" onClick={dialogClose}>Close</button>
        <button id="save" onClick={onSave}>Save</button>
      </dialog>
    </div>
  );
};

export default SectionAdd;
