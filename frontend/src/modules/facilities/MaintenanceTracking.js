import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

const MaintenanceTracking = () => {
  const [issues, setIssues] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [staff, setStaff] = useState([]);
  const [formData, setFormData] = useState({
    issueId: '',
    room: '',
    issueType: 'Equipment',
    description: '',
    priority: 'Medium',
    status: 'Reported',
    assignedTo: '',
    reportedBy: '',
  });

  useEffect(() => {
    fetchIssues();
    fetchRooms();
    fetchStaff();
  }, []);

  const fetchIssues = async () => {
    try {
      const response = await fetch(`${API_URL}/maintenance`);
      const data = await response.json();
      setIssues(data);
    } catch (error) {
      console.error('Error fetching issues:', error);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await fetch(`${API_URL}/rooms`);
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
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
      const url = editingId ? `${API_URL}/maintenance/${editingId}` : `${API_URL}/maintenance`;
      const method = editingId ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        fetchIssues();
        setFormData({ issueId: '', room: '', issueType: 'Equipment', description: '', priority: 'Medium', status: 'Reported', assignedTo: '', reportedBy: '' });
        setEditingId(null);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error saving issue:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this issue?')) {
      try {
        await fetch(`${API_URL}/maintenance/${id}`, { method: 'DELETE' });
        fetchIssues();
      } catch (error) {
        console.error('Error deleting issue:', error);
      }
    }
  };

  const handleEdit = (issue) => {
    setFormData(issue);
    setEditingId(issue._id);
    setShowForm(true);
  };

  const getPriorityColor = (priority) => {
    const colors = { Low: '#28a745', Medium: '#ffc107', High: '#fd7e14', Critical: '#dc3545' };
    return colors[priority] || '#666';
  };

  return (
    <div style={styles.container}>
      <h2>Maintenance Issue Tracking</h2>
      <p style={styles.subtitle}>Report and track maintenance issues in facilities</p>
      <button onClick={() => setShowForm(!showForm)} style={styles.button}>
        {showForm ? 'Cancel' : 'Report New Issue'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <input type="text" placeholder="Issue ID" value={formData.issueId} onChange={(e) => setFormData({...formData, issueId: e.target.value})} required style={styles.input} />
          <select value={formData.room} onChange={(e) => setFormData({...formData, room: e.target.value})} required style={styles.input}>
            <option value="">Select Room</option>
            {rooms.map(r => <option key={r._id} value={r._id}>{r.roomNumber} - {r.building}</option>)}
          </select>
          <select value={formData.issueType} onChange={(e) => setFormData({...formData, issueType: e.target.value})} style={styles.input}>
            <option>Equipment</option><option>Infrastructure</option><option>Cleaning</option><option>Electrical</option><option>Other</option>
          </select>
          <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required style={{...styles.input, minHeight: '80px'}} />
          <select value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})} style={styles.input}>
            <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
          </select>
          <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} style={styles.input}>
            <option>Reported</option><option>In Progress</option><option>Resolved</option>
          </select>
          <select value={formData.assignedTo} onChange={(e) => setFormData({...formData, assignedTo: e.target.value})} style={styles.input}>
            <option value="">Assign To (Optional)</option>
            {staff.map(s => <option key={s._id} value={s._id}>{s.firstName} {s.lastName}</option>)}
          </select>
          <button type="submit" style={styles.submitButton}>{editingId ? 'Update' : 'Report'} Issue</button>
        </form>
      )}

      <table style={styles.table}>
        <thead><tr style={styles.headerRow}>
          <th>ID</th><th>Room</th><th>Type</th><th>Priority</th><th>Status</th><th>Actions</th>
        </tr></thead>
        <tbody>
          {issues.map(i => (
            <tr key={i._id}>
              <td>{i.issueId}</td><td>{i.room?.roomNumber || 'N/A'}</td><td>{i.issueType}</td>
              <td style={{color: getPriorityColor(i.priority), fontWeight: 'bold'}}>{i.priority}</td><td>{i.status}</td>
              <td><button onClick={() => handleEdit(i)} style={styles.editBtn}>Edit</button><button onClick={() => handleDelete(i._id)} style={styles.deleteBtn}>Delete</button></td>
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

export default MaintenanceTracking;
