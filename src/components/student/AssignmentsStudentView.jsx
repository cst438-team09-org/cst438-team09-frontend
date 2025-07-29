import { useState } from 'react';
import { GRADEBOOK_URL } from '../../Constants';
import SelectTerm from '../SelectTerm';
import Messages from '../Messages';

const AssignmentsStudentView = () => {
    const [message, setMessage] = useState('');
    const [assignments, setAssignments] = useState([]);

    const fetchData = async ({ year, semester }) => {
        try {
            const response = await fetch(`${GRADEBOOK_URL}/assignments?year=${year}&semester=${semester}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': sessionStorage.getItem('jwt'),
                },
            });
            if (response.ok) {
                const data = await response.json();
                setAssignments(data);
                setMessage(''); // Clear any previous messages
            } else {
                const rc = await response.json();
                setMessage(rc);
            }
        } catch (err) {
            setMessage(err.message || 'An error occurred while fetching assignments.');
        }
    };

    const headers = ['Course', 'Title', 'Due Date', 'Score'];

    return (
        <>
            <h3>Assignments</h3>
            <Messages response={message} />

            <SelectTerm buttonText="Get Assignments" onClick={fetchData} />

            {assignments.length > 0 ? (
                <table>
                    <thead>
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {assignments.map((assignment, index) => (
                        <tr key={index}>
                            <td>{assignment.course}</td>
                            <td>{assignment.title}</td>
                            <td>{new Date(assignment.dueDate).toLocaleDateString()}</td>
                            <td>{assignment.score !== null ? assignment.score : 'N/A'}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>No assignments found for the selected term.</p>
            )}
        </>
    );
};

export default AssignmentsStudentView;
