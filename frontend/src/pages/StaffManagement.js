import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    staffId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    officeLocation: '',
    role: 'Professor',
    qualification: '',
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await fetch(`${API_URL}/staff`);
      const data = await response.json();
      setStaff(data);
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId ? `${API_URL}/staff/${editingId}` : `${API_URL}/staff`;
      const method = editingId ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        fetchStaff();
        setFormData({ staffId: '', firstName: '', lastName: '', email: '', phone: '', department: '', officeLocation: '', role: 'Professor', qualification: '' });
        setEditingId(null);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error saving staff:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await fetch(`${API_URL}/staff/${id}`, { method: 'DELETE' });
        fetchStaff();
      } catch (error) {
        console.error('Error deleting staff:', error);
      }
    }
  };

  const handleEdit = (staffMember) => {
    setFormData(staffMember);
    setEditingId(staffMember._id);
    setShowForm(true);
  };

  return (
    <div style={styles.container}>
      <h2>Staff Management</h2>
      <button onClick={() => setShowForm(!showForm)} style={styles.button}>
        {showForm ? 'Cancel' : 'Add New Staff'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Staff ID"
            value={formData.staffId}
            onChange={(e) => setFormData({...formData, staffId: e.target.value})}
            required
            style={styles.input}
          />
          <input
            type="text"
            placeholder="First Name"
            value={formData.firstName}
            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            required
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            required
            style={styles.input}
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
            style={styles.input}
          />
          <input
            type="tel"
            placeholder="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Department"
            value={formData.department}
            onChange={(e) => setFormData({...formData, department: e.target.value})}
            required
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Office Location"
            value={formData.officeLocation}
            onChange={(e) => setFormData({...formData, officeLocation: e.target.value})}
            style={styles.input}
          />
          <select
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value})}
            style={styles.input}
          >
            <option>Professor</option>
            <option>Associate Professor</option>
            <option>TA</option>
            <option>Admin</option>
          </select>
          <input
            type="text"
            placeholder="Qualification"
            value={formData.qualification}
            onChange={(e) => setFormData({...formData, qualification: e.target.value})}
            style={styles.input}
          />
          <button type="submit" style={styles.submitButton}>
            {editingId ? 'Update' : 'Create'} Staff
          </button>
        </form>
      )}

      <table style={styles.table}>
        <thead>
          <tr style={styles.headerRow}>
            <th>Staff ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {staff.map(member => (
            <tr key={member._id}>
              <td>{member.staffId}</td>
              <td>{member.firstName} {member.lastName}</td>
              <td>{member.email}</td>
              <td>{member.department}</td>
              <td>{member.role}</td>
              <td>
                <button onClick={() => handleEdit(member)} style={styles.editBtn}>Edit</button>
                <button onClick={() => handleDelete(member._id)} style={styles.deleteBtn}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: { padding: '20px' },
  button: { padding: '10px 20px', marginBottom: '20px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' },
  form: { backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '4px', marginBottom: '20px' },
  input: { display: 'block', width: '100%', marginBottom: '10px', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' },
  submitButton: { padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px' },
  headerRow: { backgroundColor: '#f5f5f5' },
  editBtn: { padding: '5px 10px', marginRight: '5px', cursor: 'pointer', backgroundColor: '#ffc107', border: 'none', borderRadius: '3px' },
  deleteBtn: { padding: '5px 10px', cursor: 'pointer', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px' },
};

export default StaffManagement;
