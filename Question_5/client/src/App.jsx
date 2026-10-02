import { useState } from "react";

function App() {
  const [page, setPage] = useState("login");

  const [token, setToken] = useState(localStorage.getItem("token"));

  function loginSuccess(newToken) {
    localStorage.setItem("token", newToken);

    setToken(newToken);

    setPage("home");
  }

  function logout() {
    localStorage.removeItem("token");

    setToken(null);

    setPage("login");
  }

  if (!token) {
    return <Login loginSuccess={loginSuccess} />;
  }

  if (page === "profile") {
    return <Profile token={token} setPage={setPage} />;
  }

  if (page === "leave") {
    return <Leave token={token} setPage={setPage} />;
  }

  return <Home setPage={setPage} logout={logout} />;
}

// ========================================
// LOGIN
// ========================================

function Login({ loginSuccess }) {
  const [empid, setEmpid] = useState("");

  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/api/login", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        empid: empid,
        password: password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      loginSuccess(data.token);
    } else {
      setMessage(data.message);
    }
  }

  return (
    <div>
      <h2>Employee Login</h2>

      <form onSubmit={handleLogin}>
        <label>Employee ID:</label>

        <input
          type="text"
          value={empid}
          onChange={(e) => setEmpid(e.target.value)}
        />

        <br />
        <br />

        <label>Password:</label>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br />
        <br />

        <button type="submit">Login</button>
      </form>

      <p>{message}</p>
    </div>
  );
}

// ========================================
// HOME
// ========================================

function Home({ setPage, logout }) {
  return (
    <div>
      <h2>Employee Home</h2>

      <p>Welcome Employee</p>

      <button onClick={() => setPage("profile")}>Page 1 - Profile</button>

      <br />
      <br />

      <button onClick={() => setPage("leave")}>
        Page 2 - Leave Application
      </button>

      <br />
      <br />

      <button onClick={logout}>Logout</button>
    </div>
  );
}

// ========================================
// PROFILE
// ========================================

function Profile({ token, setPage }) {
  const [employee, setEmployee] = useState(null);

  const [message, setMessage] = useState("");

  async function getProfile() {
    const response = await fetch("http://localhost:5000/api/profile", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    const data = await response.json();

    if (response.ok) {
      setEmployee(data);
    } else {
      setMessage(data.message);
    }
  }

  return (
    <div>
      <h2>Employee Profile</h2>

      <button onClick={getProfile}>Display Profile</button>

      <br />
      <br />

      {employee && (
        <table border="1" cellPadding="8">
          <tbody>
            <tr>
              <td>Employee ID</td>
              <td>{employee.empid}</td>
            </tr>

            <tr>
              <td>Name</td>
              <td>{employee.name}</td>
            </tr>

            <tr>
              <td>Email</td>
              <td>{employee.email}</td>
            </tr>

            <tr>
              <td>Department</td>
              <td>{employee.department}</td>
            </tr>

            <tr>
              <td>Basic Salary</td>
              <td>{employee.basicSalary}</td>
            </tr>

            <tr>
              <td>HRA</td>
              <td>{employee.hra}</td>
            </tr>

            <tr>
              <td>DA</td>
              <td>{employee.da}</td>
            </tr>

            <tr>
              <td>PF</td>
              <td>{employee.pf}</td>
            </tr>

            <tr>
              <td>Net Salary</td>
              <td>{employee.netSalary}</td>
            </tr>
          </tbody>
        </table>
      )}

      <p>{message}</p>

      <br />

      <button onClick={() => setPage("home")}>Home</button>
    </div>
  );
}

// ========================================
// LEAVE
// ========================================

function Leave({ token, setPage }) {
  const [date, setDate] = useState("");

  const [reason, setReason] = useState("");

  const [grant, setGrant] = useState("No");

  const [leaves, setLeaves] = useState([]);

  const [message, setMessage] = useState("");

  async function addLeave(e) {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/api/leave", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",

        Authorization: "Bearer " + token,
      },

      body: JSON.stringify({
        date: date,
        reason: reason,
        grant: grant,
      }),
    });

    const data = await response.json();

    setMessage(data.message);

    if (response.ok) {
      setDate("");

      setReason("");

      setGrant("No");

      getLeaves();
    }
  }

  async function getLeaves() {
    const response = await fetch("http://localhost:5000/api/leaves", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    const data = await response.json();

    setLeaves(data);
  }

  return (
    <div>
      <h2>Leave Application</h2>

      <form onSubmit={addLeave}>
        <label>Date:</label>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <br />
        <br />

        <label>Reason:</label>

        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <br />
        <br />

        <label>Grant:</label>

        <select value={grant} onChange={(e) => setGrant(e.target.value)}>
          <option value="Yes">Yes</option>

          <option value="No">No</option>
        </select>

        <br />
        <br />

        <button type="submit">Add Leave</button>
      </form>

      <p>{message}</p>

      <br />

      <button onClick={getLeaves}>List Leaves</button>

      <br />
      <br />

      {leaves.length > 0 && (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Date</th>

              <th>Reason</th>

              <th>Grant</th>
            </tr>
          </thead>

          <tbody>
            {leaves.map((leave) => (
              <tr key={leave._id}>
                <td>{leave.date}</td>

                <td>{leave.reason}</td>

                <td>{leave.grant}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <br />

      <button onClick={() => setPage("home")}>Home</button>
    </div>
  );
}

export default App;
