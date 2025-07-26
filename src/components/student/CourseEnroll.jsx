import { useState, useEffect } from 'react';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { REGISTRAR_URL } from '../../Constants';
import Messages from '../Messages';
import {Link} from "react-router-dom";

const CourseEnroll = (props) => {

  // student adds a course to their schedule

  const [sections, setSections] = useState([]);
  const [message, setMessage] = useState('');

  const fetchSections = async () => {
    // get list of open sections for enrollment
    try {
      const response = await fetch(`${REGISTRAR_URL}/sections/open`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionStorage.getItem('jwt'),
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setSections(data);
        setMessage('');
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err) {
      setMessage(err);
    }
  }

  useEffect(() => {
    fetchSections();
  }, []);


    const confirmEnroll = async (secNo) => {
        confirmAlert({
            title: 'Confirm to Enroll',
            message: 'Are you sure you want to add this course?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => doEnroll(secNo)
                },
                {
                    label: 'No',
                }
            ]
        });
    };

    const doEnroll = async (secNo) => {
        const response = await fetch(`http://localhost:8080/enrollments/sections/${secNo}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem("jwt"),
            },
        });

        if (response.ok) {
            const data = await response.json();
       setMessage(`Successfully enrolled in ${data.courseId}: ${data.title}`)

        } else {
            const data = await response.json();
            setMessage(data);
        }
    };

  const headers = ['section No', 'year', 'semester', 'course Id', 'section', 'title', 'building', 'room', 'times', 'instructor', ''];

  return (
    <div>
      <Messages response={message} />
      <h3>Open Sections Available for Enrollment</h3>
      <p>To be implemented. Display a table of sections that are open for enrollment with columns in headers.
        The last column is an "Add" button that when clicked will first confirm that user want to add
        the course, then adds the course to the students schedule.
      </p>
      <table className="Center" >
        <thead>
        <tr>
          {headers.map((s, idx) => (<th key={idx}>{s}</th>))}
        </tr>
        </thead>
        <tbody>
        {sections.map((s) => (
            <tr key={s.secNo}>
              <td>{s.secNo}</td>
              <td>{s.year}</td>
              <td>{s.semester}</td>
              <td>{s.courseId}</td>
              <td>{s.secId}</td>
              <td>{s.title}</td>
              <td>{s.building}</td>
              <td>{s.room}</td>
              <td>{s.times}</td>
              <td>{s.instructor}</td>
              <td><button onClick={() => confirmEnroll(s.secNo)}>Add</button></td>
            </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
}

export default CourseEnroll;