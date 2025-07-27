import { useState } from 'react';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { REGISTRAR_URL } from '../../Constants';
import SelectTerm from '../SelectTerm';
import Messages from '../Messages';

const ScheduleView = () => {

  // student views their class schedule for a given term

  const [enrollments, setEnrollments] = useState([]);
  const [message, setMessage] = useState('');
  const [term, setTerm] = useState({});

  const prefetchEnrollments = ({ year, semester }) => {
    setTerm({ year, semester });
    fetchEnrollments(year, semester);
  }

  const fetchEnrollments = async (year, semester) => {
    try {
      const response = await fetch(`${REGISTRAR_URL}/enrollments?year=${year}&semester=${semester}`,
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
        setEnrollments(data);
        setMessage('');
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err) {
      setMessage(err);
    }
  };
  const confirmDrop = async (enrollmentId) => {
    confirmAlert({
      title: 'Confirm to Drop',
      message: 'Are you sure you want to drop this course?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => doDrop(enrollmentId)
        },
        {
          label: 'No',
        }
      ]
    });
  };

  const doDrop = async (enrollmentId) => {
    const response = await fetch(`http://localhost:8080/enrollments/${enrollmentId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': sessionStorage.getItem("jwt"),
      },
    });

    if (response.ok) {
      fetchEnrollments(term.year, term.semester);
      setMessage('Successfully dropped the course');

    } else {
      const data = await response.json();
      setMessage(data);
    }
  };


  const headings = ["enrollmentId", "secNo", "courseId", "secId", "building", "room", "times", ""];

  return (
    <div>
      <Messages response={message} />
      <SelectTerm buttonText="Get Schedule" onClick={prefetchEnrollments} />

      <table className="Center" >
        <thead>
        <tr>
          {headings.map((s, idx) => (<th key={idx}>{s}</th>))}
        </tr>
        </thead>
        <tbody>
        {enrollments.map((e) => (
            <tr key={e.enrollmentId}>
              <td>{e.enrollmentId}</td>
              <td>{e.sectionNo}</td>
              <td>{e.courseId}</td>
              <td>{e.sectionId}</td>
              <td>{e.building}</td>
              <td>{e.room}</td>
              <td>{e.times}</td>
              <td><button onClick={() => confirmDrop(e.enrollmentId)}>Drop</button></td>
            </tr>
        ))}
        </tbody>
      </table>
    </div>
  );

}

export default ScheduleView;