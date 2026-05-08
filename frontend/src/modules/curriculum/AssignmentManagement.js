import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

const AssignmentManagement = () => {
  const [assignments, setAssignments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    assignmentId: '',
    course: '',
    title: '',
    description: '',
    type: 'Homework',
    dueDate: '',
    maxScore: '100',
  });

  useEffect(() => {
    fetchAssignments();
    fetchCourses();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await fetch(`${API_URL}/assignments`);
      const data = await response.json();
      setAssignments(data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${API_URL}/courses`);
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId ? `${API_URL}/assignments/${editingId}` : `${API_URL}/assignments`;
      const method = editingId ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...formData, maxScore: parseInt(formData.maxScore)}),
      });
      
      if (response.ok) {
        fetchAssignments();
        setFormData({ assignmentId: '', course: '', title: '', description: '', type: 'Homework', dueDate: '', maxScore: '100' });
        setEditingId(null);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error saving assignment:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this assignment?')) {
      try {
        await fetch(`${API_URL}/assignments/${id}`, { method: 'DELETE' });
        fetchAssignments();
      } catch (error) {
        console.error('Error deleting assignment:', error);
      }
    }
  };

  const handleEdit = (assignment) => {
    setFormData(assignment);
    setEditingId(assignment._id);
    setShowForm(true);
  };

  return (
    <div style={styles.container}>
      <h2>Assignment Management</h2>
      <p style={styles.subtitle}>Create and manage coursework assignments</p>
      <button onClick={() => setShowForm(!showForm)} style={styles.button}>
        {showForm ? 'Cancel' : 'Create Assignment'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <input type="text" placeholder="Assignment ID" value={formData.assignmentId} onChange={(e) => setFormData({...formData, assignmentId: e.target.value})} required style={styles.input} />
          <select value={formData.course} onChange={(e) => setFormData({...formData, course: e.target.value})} required style={styles.input}>
            <option value="">Select Course</option>
            {courses.map(c => <option key={c._id} value={c._id}>{c.code} - {c.title}</option>)}
          </select>
          <input type="text" placeholder="Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required style={styles.input} />
          <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} style={{...styles.input, minHeight: '80px'}} />
          <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} style={styles.input}>
            <option>Homework</option><option>Project</option><option>Essay</option><option>Problem Set</option>
          </select>
          <input type="datetime-local" value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} required style={styles.input} />
          <input type="number" placeholder="Max Score" value={formData.maxScore} onChange={(e) => setFormData({...formData, maxScore: e.target.value})} style={styles.input} />
          <button type="submit" style={styles.submitButton}>{editingId ? 'Update' : 'Create'} Assignment</button>
        </form>
      )}

      <table style={styles.table}>
        <thead><tr style={styles.headerRow}>
          <th>ID</th><th>Title</th><th>Course</th><th>Type</th><th>Due Date</th><th>Max Score</th><th>Actions</th>
        </tr></thead>
        <tbody>
          {assignments.map(a => (
            <tr key={a._id}>
              <td>{a.assignmentId}</td><td>{a.title}</td><td>{a.course?.code || 'N/A'}</td><td>{a.type}</td>
              <td>{new Date(a.dueDate).toLocaleDateString()}</td><td>{a.maxScore}</td>
              <td><button onClick={() => handleEdit(a)} style={styles.editBtn}>Edit</button><button onClick={() => handleDelete(a._id)} style={styles.deleteBtn}>Delete</button></td>
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

export default AssignmentManagement;
