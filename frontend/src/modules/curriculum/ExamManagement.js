import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

const ExamManagement = () => {
  const [exams, setExams] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [courses, setCourses] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    examId: '',
    course: '',
    title: '',
    examType: 'Final',
    scheduledDate: '',
    duration: '120',
    room: '',
    maxScore: '100',
  });

  useEffect(() => {
    fetchExams();
    fetchCourses();
    fetchRooms();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await fetch(`${API_URL}/exams`);
      const data = await response.json();
      setExams(data);
    } catch (error) {
      console.error('Error fetching exams:', error);
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

  const fetchRooms = async () => {
    try {
      const response = await fetch(`${API_URL}/rooms`);
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId ? `${API_URL}/exams/${editingId}` : `${API_URL}/exams`;
      const method = editingId ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...formData, duration: parseInt(formData.duration), maxScore: parseInt(formData.maxScore)}),
      });
      
      if (response.ok) {
        fetchExams();
        setFormData({ examId: '', course: '', title: '', examType: 'Final', scheduledDate: '', duration: '120', room: '', maxScore: '100' });
        setEditingId(null);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error saving exam:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this exam?')) {
      try {
        await fetch(`${API_URL}/exams/${id}`, { method: 'DELETE' });
        fetchExams();
      } catch (error) {
        console.error('Error deleting exam:', error);
      }
    }
  };

  const handleEdit = (exam) => {
    setFormData(exam);
    setEditingId(exam._id);
    setShowForm(true);
  };

  return (
    <div style={styles.container}>
      <h2>Exam Management</h2>
      <p style={styles.subtitle}>Schedule and manage examinations</p>
      <button onClick={() => setShowForm(!showForm)} style={styles.button}>
        {showForm ? 'Cancel' : 'Schedule Exam'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <input type="text" placeholder="Exam ID" value={formData.examId} onChange={(e) => setFormData({...formData, examId: e.target.value})} required style={styles.input} />
          <select value={formData.course} onChange={(e) => setFormData({...formData, course: e.target.value})} required style={styles.input}>
            <option value="">Select Course</option>
            {courses.map(c => <option key={c._id} value={c._id}>{c.code} - {c.title}</option>)}
          </select>
          <input type="text" placeholder="Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required style={styles.input} />
          <select value={formData.examType} onChange={(e) => setFormData({...formData, examType: e.target.value})} style={styles.input}>
            <option>Midterm</option><option>Final</option><option>Quiz</option><option>Practical</option>
          </select>
          <input type="datetime-local" value={formData.scheduledDate} onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})} required style={styles.input} />
          <input type="number" placeholder="Duration (minutes)" value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} required style={styles.input} />
          <select value={formData.room} onChange={(e) => setFormData({...formData, room: e.target.value})} style={styles.input}>
            <option value="">Select Room (Optional)</option>
            {rooms.map(r => <option key={r._id} value={r._id}>{r.roomNumber} - {r.building}</option>)}
          </select>
          <input type="number" placeholder="Max Score" value={formData.maxScore} onChange={(e) => setFormData({...formData, maxScore: e.target.value})} style={styles.input} />
          <button type="submit" style={styles.submitButton}>{editingId ? 'Update' : 'Schedule'} Exam</button>
        </form>
      )}

      <table style={styles.table}>
        <thead><tr style={styles.headerRow}>
          <th>ID</th><th>Course</th><th>Type</th><th>Date</th><th>Duration</th><th>Status</th><th>Actions</th>
        </tr></thead>
        <tbody>
          {exams.map(ex => (
            <tr key={ex._id}>
              <td>{ex.examId}</td><td>{ex.course?.code || 'N/A'}</td><td>{ex.examType}</td>
              <td>{new Date(ex.scheduledDate).toLocaleDateString()}</td><td>{ex.duration} min</td><td>{ex.status}</td>
              <td><button onClick={() => handleEdit(ex)} style={styles.editBtn}>Edit</button><button onClick={() => handleDelete(ex._id)} style={styles.deleteBtn}>Delete</button></td>
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

export default ExamManagement;
