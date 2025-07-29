import { useState, useRef } from 'react';
import { GRADEBOOK_URL } from '../../Constants';
import Messages from '../Messages';

const AssignmentGrade = ({ assignment }) => {

  const [message, setMessage] = useState('');
  const [grades, setGrades] = useState([]);
  const dialogRef = useRef();


  const editOpen = () => {
    setMessage('');
    setGrades([]);
    fetchGrades(assignment.id);
    dialogRef.current.showModal();
  };

  const editClose = () => {
    dialogRef.current.close();
  };

  const fetchGrades = async (assignmentId) => {
    try {
      const response = await fetch(`${GRADEBOOK_URL}/assignments/${assignmentId}/grades`,
        {
          method: 'GET',
          headers: {
            'Authorization': sessionStorage.getItem('jwt'),
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setGrades(data);
      } else {
        setMessage(data);
      }
    } catch (err) {
      setMessage(err);
    }
  }

  const handleScoreChange = (idx, newScore) => {
    const updated = [...grades];
    updated[idx] = { ...updated[idx], score: newScore };
    setGrades(updated);
  };

  const onSave = async () => {
    // 1) Client‑side range check
    for (let g of grades) {
      const num = Number(g.score);
      if (isNaN(num) || num < 0 || num > 100) {
        setMessage('Scores must be numeric values between 0 and 100.');
        return;
      }
    }

    try {
      const res = await fetch(`${GRADEBOOK_URL}/grades`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: sessionStorage.getItem('jwt'),
        },
        body: JSON.stringify(grades),
      });

      if (res.ok) {
        editClose();
      } else {
        // 2) Friendly server‑error handling
        let errMsg = 'Error saving grades.';
        try {
          const json = await res.json();
          errMsg = json;
        } catch {
          const text = await res.text();
          if (text) errMsg = text;
        }
        setMessage(errMsg);
      }
    } catch (err) {
      setMessage('Network error: ' + err.toString());
    }
  };

  const headers = ['gradeId', 'student name', 'student email', 'score'];

  return (
      <>
        <button id="gradeButton" onClick={editOpen}>
          Grade
        </button>

        <dialog ref={dialogRef}>
          <h2>Grade Assignment</h2>
          <Messages response={message} />

          <table>
            <thead>
            <tr>
              {headers.map((h, i) => (
                  <th key={i}>{h}</th>
              ))}
            </tr>
            </thead>
            <tbody>
            {grades.map((g, idx) => (
                <tr key={g.gradeId}>
                  <td>{g.gradeId}</td>
                  <td>{g.studentName}</td>
                  <td>{g.studentEmail}</td>
                  <td>
                    <input
                        type="number"
                        min="0"
                        max="100"
                        value={g.score ?? ''}
                        onChange={(e) =>
                            handleScoreChange(idx, e.target.value)
                        }
                    />
                  </td>
                </tr>
            ))}
            </tbody>
          </table>

          <div style={{ marginTop: '12px' }}>
            <button onClick={editClose}>Close</button>
            <button onClick={onSave}>Save</button>
          </div>
        </dialog>
      </>
  );
}

export default AssignmentGrade;