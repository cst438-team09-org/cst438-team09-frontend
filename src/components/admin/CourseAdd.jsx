import { useState, useRef } from "react";
import { REGISTRAR_URL } from "../../Constants";
import Messages from '../Messages';

// dialog to add course 

const CourseAdd = ({ onClose }) => {
  const [message, setMessage] = useState('');
  const [course, setCourse] = useState({ courseId: "", title: "", credits: "" });
  const dialogRef = useRef();


  const dialogOpen = () => {
    setMessage('');
    setCourse({ courseId: "", title: "", credits: "" });
    dialogRef.current.showModal();
  };

  const dialogClose = () => {
    dialogRef.current.close();
    onClose();
  };

  const editChange = (event) => {
    setCourse({ ...course, [event.target.name]: event.target.value });
  };

  const onSave = async () => {
    try {
      const response = await fetch(`${REGISTRAR_URL}/courses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": sessionStorage.getItem("jwt"),
        },
        body: JSON.stringify(course),
      });
      if (response.ok) {
        setMessage("course added");
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
      <button onClick={dialogOpen}>Add Course</button>
      <dialog ref={dialogRef}>
        <h2>Add Course</h2>
        <Messages response={message} />
        <input type='text' name="courseId" placeholder='course id' value={course.courseId} onChange={editChange} />
        <input type='text' name="title" placeholder='title' value={course.title} onChange={editChange} />
        <input type='number' name="credits" placeholder='credits' value={course.credits} onChange={editChange} />
        <button onClick={dialogClose}>Close</button>
        <button onClick={onSave}>Save</button>
      </dialog >
    </>
  );
};

export default CourseAdd;
