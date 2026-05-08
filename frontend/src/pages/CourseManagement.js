import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    description: '',
    credits: '',
    type: 'Core',
    department: '',
    semester: '',
  });

  useEffect(() => {
    fetchCourses();
  }, []);

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
      const url = editingId ? `${API_URL}/courses/${editingId}` : `${API_URL}/courses`;
      const method = editingId ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...formData, credits: parseInt(formData.credits)}),
      });
      
      if (response.ok) {
        fetchCourses();
        setFormData({ code: '', title: '', description: '', credits: '', type: 'Core', department: '', semester: '' });
        setEditingId(null);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await fetch(`${API_URL}/courses/${id}`, { method: 'DELETE' });
        fetchCourses();
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  const handleEdit = (course) => {
    setFormData(course);
    setEditingId(course._id);
    setShowForm(true);
  };

  return (
    <div style={styles.container}>
      <h2>Course Management</h2>
      <button onClick={() => setShowForm(!showForm)} style={styles.button}>
        {showForm ? 'Cancel' : 'Add New Course'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Course Code"
            value={formData.code}
            onChange={(e) => setFormData({...formData, code: e.target.value})}
            required
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Course Title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
            style={styles.input}
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            style={styles.input}
          />
          <input
            type="number"
            placeholder="Credits"
            value={formData.credits}
            onChange={(e) => setFormData({...formData, credits: e.target.value})}
            required
            style={styles.input}
          />
          <select
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
            style={styles.input}
          >
            <option>Core</option>
            <option>Elective</option>
          </select>
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
            placeholder="Semester"
            value={formData.semester}
            onChange={(e) => setFormData({...formData, semester: e.target.value})}
            style={styles.input}
          />
          <button type="submit" style={styles.submitButton}>
            {editingId ? 'Update' : 'Create'} Course
          </button>
        </form>
      )}

      <table style={styles.table}>
        <thead>
          <tr style={styles.headerRow}>
            <th>Code</th>
            <th>Title</th>
            <th>Credits</th>
            <th>Type</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map(course => (
            <tr key={course._id}>
              <td>{course.code}</td>
              <td>{course.title}</td>
              <td>{course.credits}</td>
              <td>{course.type}</td>
              <td>{course.department}</td>
              <td>
                <button onClick={() => handleEdit(course)} style={styles.editBtn}>Edit</button>
                <button onClick={() => handleDelete(course._id)} style={styles.deleteBtn}>Delete</button>
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

export default CourseManagement;
