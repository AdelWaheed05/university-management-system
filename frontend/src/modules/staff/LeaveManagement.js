import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

const LeaveManagement = () => {
  const [leaves, setLeaves] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [staff, setStaff] = useState([]);
  const [formData, setFormData] = useState({
    leaveId: '',
    staff: '',
    leaveType: 'Vacation',
    startDate: '',
    endDate: '',
    reason: '',
    status: 'Pending',
  });

  useEffect(() => {
    fetchLeaves();
    fetchStaff();
  }, []);

  const fetchLeaves = async () => {
    try {
      const response = await fetch(`${API_URL}/leaves`);
      const data = await response.json();
      setLeaves(data);
    } catch (error) {
      console.error('Error fetching leaves:', error);
    }
  };

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
      const url = editingId ? `${API_URL}/leaves/${editingId}` : `${API_URL}/leaves`;
      const method = editingId ? 'PATCH' : 'POST';
      
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...formData, numberOfDays: days}),
      });
      
      if (response.ok) {
        fetchLeaves();
        setFormData({ leaveId: '', staff: '', leaveType: 'Vacation', startDate: '', endDate: '', reason: '', status: 'Pending' });
        setEditingId(null);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error saving leave:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this leave request?')) {
      try {
        await fetch(`${API_URL}/leaves/${id}`, { method: 'DELETE' });
        fetchLeaves();
      } catch (error) {
        console.error('Error deleting leave:', error);
      }
    }
  };

  const handleEdit = (leave) => {
    setFormData(leave);
    setEditingId(leave._id);
    setShowForm(true);
  };

  const getStatusColor = (status) => {
    const colors = { Pending: '#ffc107', Approved: '#28a745', Rejected: '#dc3545' };
    return colors[status] || '#666';
  };

  return (
    <div style={styles.container}>
      <h2>Leave Management</h2>
      <p style={styles.subtitle}>Manage staff leave requests and approvals</p>
      <button onClick={() => setShowForm(!showForm)} style={styles.button}>
        {showForm ? 'Cancel' : 'Request Leave'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <input type="text" placeholder="Leave ID" value={formData.leaveId} onChange={(e) => setFormData({...formData, leaveId: e.target.value})} required style={styles.input} />
          <select value={formData.staff} onChange={(e) => setFormData({...formData, staff: e.target.value})} required style={styles.input}>
            <option value="">Select Staff Member</option>
            {staff.map(s => <option key={s._id} value={s._id}>{s.firstName} {s.lastName}</option>)}
          </select>
          <select value={formData.leaveType} onChange={(e) => setFormData({...formData, leaveType: e.target.value})} style={styles.input}>
            <option>Sick Leave</option><option>Vacation</option><option>Maternity</option><option>Study Leave</option><option>Other</option>
          </select>
          <input type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} required style={styles.input} />
          <input type="date" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} required style={styles.input} />
          <textarea placeholder="Reason for Leave" value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} style={{...styles.input, minHeight: '80px'}} />
          <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} style={styles.input}>
            <option>Pending</option><option>Approved</option><option>Rejected</option>
          </select>
          <button type="submit" style={styles.submitButton}>{editingId ? 'Update' : 'Submit'} Leave Request</button>
        </form>
      )}

      <table style={styles.table}>
        <thead><tr style={styles.headerRow}>
          <th>ID</th><th>Staff</th><th>Type</th><th>Start Date</th><th>End Date</th><th>Days</th><th>Status</th><th>Actions</th>
        </tr></thead>
        <tbody>
          {leaves.map(l => (
            <tr key={l._id}>
              <td>{l.leaveId}</td><td>{l.staff?.firstName} {l.staff?.lastName}</td><td>{l.leaveType}</td>
              <td>{new Date(l.startDate).toLocaleDateString()}</td><td>{new Date(l.endDate).toLocaleDateString()}</td>
              <td>{l.numberOfDays}</td><td style={{color: getStatusColor(l.status), fontWeight: 'bold'}}>{l.status}</td>
              <td><button onClick={() => handleEdit(l)} style={styles.editBtn}>Edit</button><button onClick={() => handleDelete(l._id)} style={styles.deleteBtn}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: { padding: '20px' },
  subtitle: { color: '#666', marginBottom: '20px', fontSize: '14px' },
  button: { padding: '10px 20px', marginBottom: '20px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' },
  form: { backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '4px', marginBottom: '20px' },
  input: { display: 'block', width: '100%', marginBottom: '10px', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' },
  submitButton: { padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px' },
  headerRow: { backgroundColor: '#2c3e50', color: 'white' },
  editBtn: { padding: '5px 10px', marginRight: '5px', cursor: 'pointer', backgroundColor: '#ffc107', border: 'none', borderRadius: '3px' },
  deleteBtn: { padding: '5px 10px', cursor: 'pointer', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px' },
};

export default LeaveManagement;
