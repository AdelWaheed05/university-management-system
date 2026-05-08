import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

const ParentPortal = () => {
  const [parents, setParents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedParent, setSelectedParent] = useState(null);
  const [formData, setFormData] = useState({
    parentId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    linkedStudent: '',
    relationship: 'Parent',
  });

  useEffect(() => {
    fetchParents();
    fetchStudents();
  }, []);

  const fetchParents = async () => {
    try {
      const response = await fetch(`${API_URL}/parents`);
      const data = await response.json();
      setParents(data);
    } catch (error) {
      console.error('Error fetching parents:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${API_URL}/students`);
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId ? `${API_URL}/parents/${editingId}` : `${API_URL}/parents`;
      const method = editingId ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        fetchParents();
        setFormData({ parentId: '', firstName: '', lastName: '', email: '', phone: '', linkedStudent: '', relationship: 'Parent' });
        setEditingId(null);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error saving parent:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this parent account?')) {
      try {
        await fetch(`${API_URL}/parents/${id}`, { method: 'DELETE' });
        fetchParents();
      } catch (error) {
        console.error('Error deleting parent:', error);
      }
    }
  };

  const handleEdit = (parent) => {
    setFormData(parent);
    setEditingId(parent._id);
    setShowForm(true);
  };

  return (
    <div style={styles.container}>
      <h2>Parent Portal</h2>
      <p style={styles.subtitle}>Secure parent access to student progress and communication</p>
      <button onClick={() => setShowForm(!showForm)} style={styles.button}>
        {showForm ? 'Cancel' : 'Add Parent Account'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <input type="text" placeholder="Parent ID" value={formData.parentId} onChange={(e) => setFormData({...formData, parentId: e.target.value})} required style={styles.input} />
          <input type="text" placeholder="First Name" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} required style={styles.input} />
          <input type="text" placeholder="Last Name" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} required style={styles.input} />
          <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required style={styles.input} />
          <input type="tel" placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} style={styles.input} />
          <select value={formData.linkedStudent} onChange={(e) => setFormData({...formData, linkedStudent: e.target.value})} required style={styles.input}>
            <option value="">Link to Student</option>
            {students.map(s => <option key={s._id} value={s._id}>{s.firstName} {s.lastName} (ID: {s.studentId})</option>)}
          </select>
          <select value={formData.relationship} onChange={(e) => setFormData({...formData, relationship: e.target.value})} style={styles.input}>
            <option>Parent</option><option>Guardian</option><option>Emergency Contact</option>
          </select>
          <button type="submit" style={styles.submitButton}>{editingId ? 'Update' : 'Create'} Parent Account</button>
        </form>
      )}

      <div style={styles.layout}>
        <div style={styles.parentsList}>
          <h3>Parent Accounts</h3>
          {parents.map(p => (
            <div key={p._id} onClick={() => setSelectedParent(p)} style={{...styles.parentCard, backgroundColor: selectedParent === p ? '#e3f2fd' : 'white'}}>
              <strong>{p.firstName} {p.lastName}</strong>
              <small>{p.email}</small>
              <small>Student: {p.linkedStudent?.firstName}</small>
            </div>
          ))}
        </div>

        <div style={styles.detailsPanel}>
          {selectedParent ? (
            <div>
              <h3>Parent Details</h3>
              <div style={styles.detailsContent}>
                <p><strong>Name:</strong> {selectedParent.firstName} {selectedParent.lastName}</p>
                <p><strong>Email:</strong> {selectedParent.email}</p>
                <p><strong>Phone:</strong> {selectedParent.phone}</p>
                <p><strong>Relationship:</strong> {selectedParent.relationship}</p>
                <p><strong>Linked Student:</strong> {selectedParent.linkedStudent?.firstName} {selectedParent.linkedStudent?.lastName}</p>
                <p><strong>Student Enrollment:</strong> {selectedParent.linkedStudent?.enrollmentStatus || 'N/A'}</p>
                
                <h4 style={{marginTop: '20px'}}>Student Academic Progress</h4>
                <table style={styles.enrollmentTable}>
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Grade</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedParent.linkedStudent?.enrollments?.length > 0 ? (
                      selectedParent.linkedStudent.enrollments.map((e, idx) => (
                        <tr key={idx}>
                          <td>{e.course?.code || 'N/A'}</td>
                          <td>{e.grade || 'Not Graded'}</td>
                          <td>{e.status}</td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="3">No enrollments</td></tr>
                    )}
                  </tbody>
                </table>

                <div style={styles.actionButtons}>
                  <button onClick={() => handleEdit(selectedParent)} style={styles.editBtn}>Edit Account</button>
                  <button onClick={() => handleDelete(selectedParent._id)} style={styles.deleteBtn}>Delete Account</button>
                </div>
              </div>
            </div>
          ) : (
            <p style={{textAlign: 'center', color: '#999'}}>Select a parent account to view details</p>
          )}
        </div>
      </div>
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
  layout: { display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px', marginTop: '20px' },
  parentsList: { backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '4px', height: 'fit-content' },
  parentCard: { padding: '12px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', userSelect: 'none' },
  detailsPanel: { backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '4px' },
  detailsContent: { backgroundColor: 'white', padding: '15px', borderRadius: '4px' },
  enrollmentTable: { width: '100%', borderCollapse: 'collapse', marginTop: '10px', fontSize: '14px' },
  actionButtons: { display: 'flex', gap: '10px', marginTop: '20px' },
  editBtn: { padding: '8px 15px', cursor: 'pointer', backgroundColor: '#ffc107', border: 'none', borderRadius: '3px', flex: 1 },
  deleteBtn: { padding: '8px 15px', cursor: 'pointer', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', flex: 1 },
};

export default ParentPortal;
