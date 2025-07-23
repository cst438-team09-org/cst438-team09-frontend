import { useState } from "react";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import SectionUpdate from "./SectionUpdate";
import SectionAdd from "./SectionAdd";
import { REGISTRAR_URL } from "../../Constants";
import Messages from '../Messages';

// display a list of sections for year, semester and courseId.
//  courseId can be partial.  Example, "cs" will display all sections for courses beginning with "cs"
//  links to edit and delete a section
//  button to add a new section

function SectionsView() {

  const [sections, setSections] = useState([]);
  const [search, setSearch] = useState({ courseId: "", year: "", semester: "", });
  const [message, setMessage] = useState("");

  const fetchSections = async () => {
    if (search.courseId === "" || search.year === "" || search.semester === "") {
      setMessage("Enter search parameters");
    } else {
      try {
        const response = await fetch(
          `${REGISTRAR_URL}/courses/${search.courseId}/sections?year=${search.year}&semester=${search.semester}`,
          {
            method: "GET",
            headers: {
              "Authorization": sessionStorage.getItem("jwt"),
            }
          }
        );
        if (response.ok) {
          const data = await response.json();
          setSections(data);
          setMessage('');
        } else {
          const data = await response.json();
          setMessage(data);
        }
      } catch (err) {
        setMessage(err);
      }
    }
  };

  const deleteSection = async (secNo) => {
    try {
      const response = await fetch(`${REGISTRAR_URL}/sections/${secNo}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": sessionStorage.getItem("jwt"),
        },
      });
      if (response.ok) {
        setMessage("Section deleted");
        fetchSections();
      } else {
        const data = await response.json();
        setMessage(data);
      }
    } catch (err) {
      setMessage(err);
    }
  };

  const editChange = (event) => {
    setSearch({ ...search, [event.target.name]: event.target.value });
  };

  const onDelete = (e) => {
    const row_idx = e.target.parentNode.parentNode.rowIndex - 1;
    const secNo = sections[row_idx].secNo;
    confirmAlert({
      title: "Confirm to delete",
      message: "Do you really want to delete?",
      buttons: [
        {
          label: "Yes",
          onClick: () => deleteSection(secNo),
        },
        {
          label: "No",
        },
      ],
    });
  };

  const headers = ["SecNo", "CourseId", "SecId", "Year", "Semester", "Building", "Room", "Times", "", "",];

  return (
    <div>
      <h3>Sections</h3>
      <Messages response={message} />
      <h4>Enter course prefix, year, semester. Example cst 2024 Spring</h4>
      <table className="Center">
        <tbody>
          <tr>
            <td>Course Prefix:</td>
            <td>
              <input type="text" name="courseId" placeholder="course id" value={search.courseId} onChange={editChange} />
            </td>
          </tr>
          <tr>
            <td>Year:</td>
            <td>
              <input type="text" name="year" placeholder="year" value={search.year} onChange={editChange} />
            </td>
          </tr>
          <tr>
            <td>Semester:</td>
            <td>
              <input type="text" name="semester" placeholder="semester" value={search.semester} onChange={editChange} />
            </td>
          </tr>
        </tbody>
      </table>
      <br />
      <button type="submit" onClick={fetchSections}>
        Search for Sections
      </button>
      <br />
      <br />
      <table className="Center">
        <thead>
          <tr>
            {headers.map((s, idx) => (
              <th key={idx}>{s}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sections.map((s) => (
            <tr key={s.secNo}>
              <td>{s.secNo}</td>
              <td>{s.courseId}</td>
              <td>{s.secId}</td>
              <td>{s.year}</td>
              <td>{s.semester}</td>
              <td>{s.building}</td>
              <td>{s.room}</td>
              <td>{s.times}</td>
              <td>
                <SectionUpdate editSection={s} onClose={fetchSections} />
              </td>
              <td>
                <button onClick={onDelete}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <SectionAdd onClose={fetchSections} />
    </div>
  );
}
export default SectionsView;
