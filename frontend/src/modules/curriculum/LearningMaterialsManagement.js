import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

const LearningMaterialsManagement = () => {
  const [materials, setMaterials] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    materialId: '',
    course: '',
    title: '',
    type: 'Lecture Notes',
    description: '',
    url: '',
    accessLevel: 'Class Only',
  });

  useEffect(() => {
    fetchMaterials();
    fetchCourses();
  }, []);

  const fetchMaterials = async () => {
    try {
      const response = await fetch(`${API_URL}/materials`);
      const data = await response.json();
      setMaterials(data);
    } catch (error) {
      console.error('Error fetching materials:', error);
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
      const url = editingId ? `${API_URL}/materials/${editingId}` : `${API_URL}/materials`;
      const method = editingId ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        fetchMaterials();
        setFormData({ materialId: '', course: '', title: '', type: 'Lecture Notes', description: '', url: '', accessLevel: 'Class Only' });
        setEditingId(null);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error saving material:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this material?')) {
      try {
        await fetch(`${API_URL}/materials/${id}`, { method: 'DELETE' });
        fetchMaterials();
      } catch (error) {
        console.error('Error deleting material:', error);
      }
    }
  };

  const handleEdit = (material) => {
    setFormData(material);
    setEditingId(material._id);
    setShowForm(true);
  };

  return (
    <div style={styles.container}>
      <h2>Learning Materials Management</h2>
      <p style={styles.subtitle}>Upload and manage course learning materials</p>
      <button onClick={() => setShowForm(!showForm)} style={styles.button}>
        {showForm ? 'Cancel' : 'Add Material'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <input type="text" placeholder="Material ID" value={formData.materialId} onChange={(e) => setFormData({...formData, materialId: e.target.value})} required style={styles.input} />
          <select value={formData.course} onChange={(e) => setFormData({...formData, course: e.target.value})} required style={styles.input}>
            <option value="">Select Course</option>
            {courses.map(c => <option key={c._id} value={c._id}>{c.code} - {c.title}</option>)}
          </select>
          <input type="text" placeholder="Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required style={styles.input} />
          <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} style={styles.input}>
            <option>Lecture Notes</option><option>Video</option><option>Article</option><option>Ebook</option><option>Code Example</option><option>Other</option>
          </select>
          <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} style={{...styles.input, minHeight: '80px'}} />
          <input type="url" placeholder="URL/Link" value={formData.url} onChange={(e) => setFormData({...formData, url: e.target.value})} style={styles.input} />
          <select value={formData.accessLevel} onChange={(e) => setFormData({...formData, accessLevel: e.target.value})} style={styles.input}>
            <option>Public</option><option>Class Only</option><option>Restricted</option>
          </select>
          <button type="submit" style={styles.submitButton}>{editingId ? 'Update' : 'Upload'} Material</button>
        </form>
      )}

      <table style={styles.table}>
        <thead><tr style={styles.headerRow}>
          <th>ID</th><th>Title</th><th>Course</th><th>Type</th><th>Access</th><th>Views</th><th>Actions</th>
        </tr></thead>
        <tbody>
          {materials.map(m => (
            <tr key={m._id}>
              <td>{m.materialId}</td><td>{m.title}</td><td>{m.course?.code || 'N/A'}</td><td>{m.type}</td>
              <td>{m.accessLevel}</td><td>{m.views}</td>
              <td><button onClick={() => handleEdit(m)} style={styles.editBtn}>Edit</button><button onClick={() => handleDelete(m._id)} style={styles.deleteBtn}>Delete</button></td>
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

export default LearningMaterialsManagement;
