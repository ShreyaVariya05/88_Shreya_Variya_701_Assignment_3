import { useEffect, useState } from "react";

function App() {
  const [students, setStudents] = useState([]);

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [age, setAge] = useState("");

  const [course, setCourse] = useState("");

  const [editId, setEditId] = useState(null);

  // Get students when page loads

  useEffect(() => {
    getStudents();
  }, []);

  // =====================================
  // GET STUDENTS
  // =====================================

  async function getStudents() {
    const response = await fetch("http://localhost:5000/api/students");

    const data = await response.json();

    setStudents(data);
  }

  // =====================================
  // ADD / UPDATE STUDENT
  // =====================================

  async function saveStudent(e) {
    e.preventDefault();

    const studentData = {
      name: name,

      email: email,

      age: age,

      course: course,
    };

    // UPDATE

    if (editId) {
      await fetch(`http://localhost:5000/api/students/${editId}`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(studentData),
      });
    }

    // ADD
    else {
      await fetch("http://localhost:5000/api/students", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(studentData),
      });
    }

    clearForm();

    getStudents();
  }

  // =====================================
  // EDIT
  // =====================================

  function editStudent(student) {
    setEditId(student.id);

    setName(student.name);

    setEmail(student.email);

    setAge(student.age);

    setCourse(student.course);
  }

  // =====================================
  // DELETE
  // =====================================

  async function deleteStudent(id) {
    await fetch(`http://localhost:5000/api/students/${id}`, {
      method: "DELETE",
    });

    getStudents();
  }

  // =====================================
  // CLEAR FORM
  // =====================================

  function clearForm() {
    setEditId(null);

    setName("");

    setEmail("");

    setAge("");

    setCourse("");
  }

  return (
    <div>
      <h2>Student CRUD</h2>

      <h3>{editId ? "Update Student" : "Add Student"}</h3>

      <form onSubmit={saveStudent}>
        <label>Name:</label>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <br />
        <br />

        <label>Email:</label>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <br />
        <br />

        <label>Age:</label>

        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />

        <br />
        <br />

        <label>Course:</label>

        <input
          type="text"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          required
        />

        <br />
        <br />

        <button type="submit">
          {editId ? "Update Student" : "Add Student"}
        </button>

        {editId && (
          <button type="button" onClick={clearForm}>
            Cancel
          </button>
        )}
      </form>

      <hr />

      <h3>Student List</h3>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>

            <th>Name</th>

            <th>Email</th>

            <th>Age</th>

            <th>Course</th>

            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.id}</td>

              <td>{student.name}</td>

              <td>{student.email}</td>

              <td>{student.age}</td>

              <td>{student.course}</td>

              <td>
                <button onClick={() => editStudent(student)}>Edit</button>{" "}
                <button onClick={() => deleteStudent(student.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
