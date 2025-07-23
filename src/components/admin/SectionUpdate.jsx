import { useState, useRef } from "react";
import { REGISTRAR_URL } from "../../Constants";
import Messages from '../Messages';

// dialog to edit section's section id, building, room, times, instructor email

const SectionUpdate = ({ editSection, onClose }) => {

  const [message, setMessage] = useState('');
  const [section, setSection] = useState({});
  const dialogRef = useRef();

  /*
   *  dialog for edit section
   */
  const dialogOpen = () => {
    setMessage("");
    setSection(editSection);
    dialogRef.current.showModal();
  };

  const dialogClose = () => {
    dialogRef.current.close();
    onClose();
  };

  const editChange = (event) => {
    setSection({ ...section, [event.target.name]: event.target.value });
  };


  const saveSection = async () => {
    try {
      const response = await fetch(`${REGISTRAR_URL}/sections`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": sessionStorage.getItem("jwt"),
        },
        body: JSON.stringify(section),
      });
      if (response.ok) {
        setMessage("section saved");
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err) {
      setMessage(err);
    }
  };

  return (
    <div>
      <button onClick={dialogOpen}>Edit</button>
      <dialog ref={dialogRef}>
        <h2>Edit Section</h2>
        <Messages response={message} />
        <input type="text" name="secNo" value={section.secNo} readOnly />
        <input type="text" name="year" value={section.year} readOnly />
        <input type="text" name="semester" value={section.semester} readOnly />
        <input type="text" name="courseId" value={section.courseId} readOnly />
        <input type="text" name="secId" value={section.secId} placeholder="section id" onChange={editChange} />
        <input type="text" name="building" value={section.building} placeholder="building" onChange={editChange} />
        <input type="text" name="room" value={section.room} placeholder="room" onChange={editChange} />
        <input type="text" name="times" value={section.times} placeholder="times" onChange={editChange} />
        <input type="email" name="instructorEmail" value={section.instructorEmail} placeholder="instructor email" onChange={editChange} />
        <button onClick={dialogClose}>Close</button>
        <button onClick={saveSection}>Save</button>
      </dialog>
    </div>
  );
};

export default SectionUpdate;
