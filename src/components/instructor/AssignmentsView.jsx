import {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom'
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import {GRADEBOOK_URL} from '../../Constants';
import AssignmentAdd from './AssignmentAdd';
import AssignmentUpdate from './AssignmentUpdate';
import AssignmentGrade from './AssignmentGrade';
import Messages from '../Messages';


const AssignmentsView = () => {

    const [assignments, setAssignments] = useState([]);
    const [message, setMessage] = useState('');

    const location = useLocation();
    const {secNo, courseId, secId} = location.state;


    const fetchAssignments = async () => {

        try {
            const response = await fetch(`${GRADEBOOK_URL}/sections/${secNo}/assignments`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': sessionStorage.getItem("jwt"),
                    },
                }
            );
            if (response.ok) {
                const data = await response.json();
                setAssignments(data);
            } else {
                const body = await response.json();
                setMessage(body);
            }
        } catch (err) {
            setMessage(err);
        }
    }

    useEffect(() => {
        fetchAssignments()
    }, []);

    const deleteAssignment = async (id) => {
        try {
            const response = await fetch(
                `${GRADEBOOK_URL}/assignments/${id}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: sessionStorage.getItem('jwt'),
                    },
                }
            );
            if (response.ok) {
                fetchAssignments();
            } else {
                const err = await response.json();
                setMessage(err);
            }
        } catch (err) {
            setMessage(err.toString());
        }
    };

    const confirmDelete = (id) => {
        confirmAlert({
            title: 'Confirm to delete',
            message: `Do you really want to delete assignment ${id}?`,
            buttons: [
                {label: 'Yes', onClick: () => deleteAssignment(id)},
                {label: 'No'},
            ],
        });
    };


    const headers = ['id', 'Title', 'Due Date', '', '', ''];

    return (
        <div>
            <h2>
                Assignments for {courseId} - Section {secNo}
            </h2>
            <Messages response={message}/>

            <table>
                <thead>
                <tr>
                    {headers.map((h, idx) => (
                        <th key={idx}>{h}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {assignments.map((a) => (
                    <tr key={a.id}>
                        <td>{a.id}</td>
                        <td>{a.title}</td>
                        <td>{a.dueDate}</td>
                        <td>
                            <AssignmentUpdate
                                editAssignment={a}
                                onClose={fetchAssignments}
                            />
                        </td>
                        <td>
                            <button onClick={() => confirmDelete(a.id)}>
                                Delete
                            </button>
                        </td>
                        <td>
                            <AssignmentGrade
                                assignment={a}
                                onSave={fetchAssignments}
                            />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <AssignmentAdd
                secNo={secNo}
                secId={secId}
                courseId={courseId}
                onClose={fetchAssignments}
            />
        </div>
    );
}

export default AssignmentsView;
