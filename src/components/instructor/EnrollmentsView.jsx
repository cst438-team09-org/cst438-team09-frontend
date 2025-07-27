import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { GRADEBOOK_URL } from '../../Constants';
import Messages from '../Messages';

const EnrollmentsView = () => {

  const [enrollments, setEnrollments] = useState([]);
  const [message, setMessage] = useState('');

  const location = useLocation();
  const { secNo, courseId, secId } = location.state;

  const fetchEnrollments = async () => {
    try {
      const response = await fetch(`${GRADEBOOK_URL}/sections/${secNo}/enrollments`,
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
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err) {
      setMessage(err);
    }
  }

  useEffect(() => {
    fetchEnrollments()
  }, []);

  const setGrade = (enrollmentId, grade) => {
    setEnrollments((enrollments) =>
        enrollments.map((enrollment) =>
            enrollment.enrollmentId === enrollmentId ? { ...enrollment, grade: grade } : enrollment
        )
    );
  }

  const saveGrades = async () => {
    const response = await fetch(`http://localhost:8080/enrollments`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': sessionStorage.getItem("jwt"),
      },
      body: JSON.stringify(enrollments)
    });

    if (response.ok) {
      setMessage('Successfully saved grades');

    } else {
      const data = await response.json();
      setMessage(data);
    }
  };

  const headers = ['enrollment id', 'student id', 'name', 'email', 'grade'];

  return (
    <>
      <h3> {courseId}-{secId} Enrollments</h3>
      <Messages response={message} />
      <p>To be implemented. Display table with column headers as given in headers.
        Allow user to edit the grade.  One button to Save all grades.
      </p>
      <table className="Center" >
        <thead>
        <tr>
          {headers.map((s, idx) => (<th key={idx}>{s}</th>))}
        </tr>
        </thead>
        <tbody>
        {enrollments.map((e) => (
            <tr key={e.enrollmentId}>
              <td>{e.enrollmentId}</td>
              <td>{e.studentId}</td>
              <td>{e.name}</td>
              <td>{e.email}</td>
              <td>{e.grade}</td>
              <td><input type="text" value={e.grade} onChange={(evt) => {setGrade(e.enrollmentId, evt.target.value)} }/></td>
            </tr>
        ))}
        </tbody>
      </table>
      <button onClick={() => saveGrades()}>Save Grades</button>
    </>
  );
}

export default EnrollmentsView;
