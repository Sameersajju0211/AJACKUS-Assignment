import React, { useState, useEffect } from "react";
import "./App.css";

const API_URL = "https://jsonplaceholder.typicode.com/users";

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ id: null, name: "", email: "", department: "" });
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch users.");
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError("Failed to fetch users. Please try again later.");
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const method = form.id ? "PUT" : "POST";
      const url = form.id ? `${API_URL}/${form.id}` : API_URL;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Failed to save user.");

      const updatedUser = await response.json();

      if (form.id) {
        setUsers(users.map((user) => (user.id === form.id ? updatedUser : user)));
      } else {
        setUsers([...users, { ...updatedUser, id: users.length + 1 }]); // Add mock ID for display
      }

      setForm({ id: null, name: "", email: "", department: "" });
      setIsModalOpen(false);
    } catch (err) {
      setError("Failed to save user. Please try again.");
    }
  };

  const handleEditUser = (user) => {
    setForm(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete user.");
      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      setError("Failed to delete user. Please try again.");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="App">
      <h1>User Management Dashboard</h1>
      {error && <p className="error">{error}</p>}

      <div className="controls">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <button className="add-button" onClick={() => setIsModalOpen(true)}>
          + Add User
        </button>
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.department || "N/A"}</td>
              <td>
                <button className="edit-button" onClick={() => handleEditUser(user)}>
                  Edit
                </button>
                <button className="delete-button" onClick={() => handleDeleteUser(user.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>{form.id ? "Edit User" : "Add User"}</h2>
            <form onSubmit={handleFormSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleInputChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="department"
                placeholder="Department"
                value={form.department}
                onChange={handleInputChange}
              />
              <div className="modal-actions">
                <button type="submit" className="save-button">
                  Save
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
