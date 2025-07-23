import { useState, useRef } from "react";
import { REGISTRAR_URL } from "../../Constants";
import Messages from '../Messages';

const CourseUpdate = ({ editCourse, onClose }) => {

  const [message, setMessage] = useState('');
  const [course, setCourse] = useState({ courseId: "", title: "", credits: "" });
  const dialogRef = useRef();
  /*
   *  dialog to allow changes to course title and credits
   */
  const dialogOpen = () => {
    setMessage("");
    setCourse(editCourse);
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
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": sessionStorage.getItem("jwt"),
        },
        body: JSON.stringify(course),
      });
      if (response.ok) {
        dialogClose();
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
        <h2>Edit Course</h2>
        <Messages response={message} />
        <input type="text" name="courseId" readOnly value={course.courseId} />
        <input type="text" name="title" value={course.title} placeholder="title" onChange={editChange} />
        <input type="number" name="credits" value={course.credits} placeholder="credits" onChange={editChange} />
        <button onClick={dialogClose}>Close</button>
        <button onClick={onSave}>Save</button>
      </dialog>
    </>
  );
};

export default CourseUpdate;
