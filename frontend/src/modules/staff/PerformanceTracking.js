import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

const PerformanceTracking = () => {
  const [performances, setPerformances] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [staff, setStaff] = useState([]);
  const [formData, setFormData] = useState({
    performanceId: '',
    staff: '',
    evaluationYear: new Date().getFullYear(),
    teachingQuality: '3',
    researchPublications: '0',
    studentFeedback: '3',
    overallRating: '3',
    comments: '',
  });

  useEffect(() => {
    fetchPerformances();
    fetchStaff();
  }, []);

  const fetchPerformances = async () => {
    try {
      const response = await fetch(`${API_URL}/performance`);
      const data = await response.json();
      setPerformances(data);
    } catch (error) {
      console.error('Error fetching performances:', error);
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
      const url = editingId ? `${API_URL}/performance/${editingId}` : `${API_URL}/performance`;
      const method = editingId ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...formData, teachingQuality: parseInt(formData.teachingQuality), studentFeedback: parseInt(formData.studentFeedback), overallRating: parseInt(formData.overallRating), evaluationYear: parseInt(formData.evaluationYear)}),
      });
      
      if (response.ok) {
        fetchPerformances();
        setFormData({ performanceId: '', staff: '', evaluationYear: new Date().getFullYear(), teachingQuality: '3', researchPublications: '0', studentFeedback: '3', overallRating: '3', comments: '' });
        setEditingId(null);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error saving performance:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this performance record?')) {
      try {
        await fetch(`${API_URL}/performance/${id}`, { method: 'DELETE' });
        fetchPerformances();
      } catch (error) {
        console.error('Error deleting performance:', error);
      }
    }
  };

  const handleEdit = (perf) => {
    setFormData(perf);
    setEditingId(perf._id);
    setShowForm(true);
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return '#28a745';
    if (rating >= 3) return '#ffc107';
    return '#dc3545';
  };

  return (
    <div style={styles.container}>
      <h2>Staff Performance Tracking</h2>
      <p style={styles.subtitle}>Evaluate and track staff performance metrics</p>
      <button onClick={() => setShowForm(!showForm)} style={styles.button}>
        {showForm ? 'Cancel' : 'Add Performance Record'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <input type="text" placeholder="Performance ID" value={formData.performanceId} onChange={(e) => setFormData({...formData, performanceId: e.target.value})} required style={styles.input} />
          <select value={formData.staff} onChange={(e) => setFormData({...formData, staff: e.target.value})} required style={styles.input}>
            <option value="">Select Staff Member</option>
            {staff.map(s => <option key={s._id} value={s._id}>{s.firstName} {s.lastName}</option>)}
          </select>
          <input type="number" placeholder="Evaluation Year" value={formData.evaluationYear} onChange={(e) => setFormData({...formData, evaluationYear: e.target.value})} style={styles.input} />
          <select value={formData.teachingQuality} onChange={(e) => setFormData({...formData, teachingQuality: e.target.value})} style={styles.input}>
            <option value="1">1 - Needs Improvement</option><option value="2">2 - Below Average</option><option value="3">3 - Average</option><option value="4">4 - Good</option><option value="5">5 - Excellent</option>
          </select>
          <input type="number" placeholder="Research Publications" value={formData.researchPublications} onChange={(e) => setFormData({...formData, researchPublications: e.target.value})} style={styles.input} />
          <select value={formData.studentFeedback} onChange={(e) => setFormData({...formData, studentFeedback: e.target.value})} style={styles.input}>
            <option value="1">1 - Poor</option><option value="2">2 - Fair</option><option value="3">3 - Good</option><option value="4">4 - Very Good</option><option value="5">5 - Excellent</option>
          </select>
          <select value={formData.overallRating} onChange={(e) => setFormData({...formData, overallRating: e.target.value})} style={styles.input}>
            <option value="1">1 - Below Average</option><option value="2">2 - Average</option><option value="3">3 - Good</option><option value="4">4 - Very Good</option><option value="5">5 - Outstanding</option>
          </select>
          <textarea placeholder="Comments" value={formData.comments} onChange={(e) => setFormData({...formData, comments: e.target.value})} style={{...styles.input, minHeight: '80px'}} />
          <button type="submit" style={styles.submitButton}>{editingId ? 'Update' : 'Create'} Performance Record</button>
        </form>
      )}

      <table style={styles.table}>
        <thead><tr style={styles.headerRow}>
          <th>ID</th><th>Staff</th><th>Year</th><th>Teaching</th><th>Publications</th><th>Student Feedback</th><th>Overall</th><th>Actions</th>
        </tr></thead>
        <tbody>
          {performances.map(p => (
            <tr key={p._id}>
              <td>{p.performanceId}</td><td>{p.staff?.firstName} {p.staff?.lastName}</td><td>{p.evaluationYear}</td>
              <td style={{color: getRatingColor(p.teachingQuality)}}>{p.teachingQuality}/5</td><td>{p.researchPublications}</td>
              <td style={{color: getRatingColor(p.studentFeedback)}}>{p.studentFeedback}/5</td>
              <td style={{color: getRatingColor(p.overallRating), fontWeight: 'bold'}}>{p.overallRating}/5</td>
              <td><button onClick={() => handleEdit(p)} style={styles.editBtn}>Edit</button><button onClick={() => handleDelete(p._id)} style={styles.deleteBtn}>Delete</button></td>
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

export default PerformanceTracking;
