import { useState, useEffect } from "react";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import CourseUpdate from "./CourseUpdate";
import CourseAdd from "./CourseAdd";
import { REGISTRAR_URL } from "../../Constants";
import Messages from '../Messages';


// display list of courses with link to edit or delete a course
//  button for adding new course

function CoursesView() {

  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState('');

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${REGISTRAR_URL}/courses`,
        {
          method: "GET",
          headers: {
            "Authorization": sessionStorage.getItem("jwt"),
          }
        });
      if (response.ok) {
        const courses = await response.json();
        setCourses(courses);
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err) {
      setMessage(err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);



  const deleteCourse = async (courseId) => {
    try {
      const response = await fetch(`${REGISTRAR_URL}/courses/${courseId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": sessionStorage.getItem("jwt"),
        },
      });
      if (response.ok) {
        setMessage("Course deleted");
        fetchCourses();
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err) {
      setMessage(err);
    }
  };

  const onDelete = (courseId) => {
    confirmAlert({
      title: "Confirm to delete",
      message: "Do you really want to delete?",
      buttons: [
        {
          label: "Yes",
          onClick: () => deleteCourse(courseId),
        },
        {
          label: "No",
        },
      ],
    });
  };

  const headers = ["CourseId", "Title", "Credits", "", ""];

  return (
    <div>
      <h3>Courses</h3>
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
          {courses.map((c) => (
            <tr key={c.courseId}>
              <td>{c.courseId}</td>
              <td>{c.title}</td>
              <td>{c.credits}</td>
              <td><CourseUpdate editCourse={c} onClose={fetchCourses} /></td>
              <td><button onClick={() => onDelete(c.courseId)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <CourseAdd onClose={fetchCourses} />
    </div>
  );
}
export default CoursesView;
