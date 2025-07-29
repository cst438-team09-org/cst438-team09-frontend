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
  };

  const fetchEnrollments = async (year, semester) => {
    try {
      const response = await fetch(`${REGISTRAR_URL}/enrollments?year=${year}&semester=${semester}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.getItem('jwt'),
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEnrollments(data);
        setMessage('');
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err) {
      setMessage(err.message || 'An error occurred while fetching enrollments.');
    }
  };

  const dropEnrollment = async (enrollmentId) => {
    try {
      const response = await fetch(`${REGISTRAR_URL}/enrollments/${enrollmentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.getItem('jwt'),
        },
      });

      if (response.ok) {
        setEnrollments(enrollments.filter(enrollment => enrollment.enrollmentId !== enrollmentId));
        setMessage('Enrollment dropped successfully.');
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err) {
      setMessage(err.message || 'An error occurred while dropping the enrollment.');
    }
  };

  const handleDropClick = (enrollmentId) => {
    confirmAlert({
      title: 'Confirm to drop',
      message: 'Are you sure you want to drop this section?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => dropEnrollment(enrollmentId)
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ]
    });
  };

  const headings = ["Enrollment ID", "Section No", "Course ID", "Section ID", "Building", "Room", "Times", "Actions"];

  return (
      <div>
        <Messages response={message} />
        <SelectTerm buttonText="Get Schedule" onClick={prefetchEnrollments} />
        {enrollments.length > 0 ? (
            <table>
              <thead>
              <tr>
                {headings.map((heading, index) => (
                    <th key={index}>{heading}</th>
                ))}
              </tr>
              </thead>
              <tbody>
              {enrollments.map((enrollment) => (
                  <tr key={enrollment.enrollmentId}>
                    <td>{enrollment.enrollmentId}</td>
                    <td>{enrollment.secNo}</td>
                    <td>{enrollment.courseId}</td>
                    <td>{enrollment.secId}</td>
                    <td>{enrollment.building}</td>
                    <td>{enrollment.room}</td>
                    <td>{enrollment.times}</td>
                    <td>
                      <button onClick={() => handleDropClick(enrollment.enrollmentId)}>Drop</button>
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
        ) : (
            <p>No enrollments found for the selected term.</p>
        )}
      </div>
  );
};

export default ScheduleView;
