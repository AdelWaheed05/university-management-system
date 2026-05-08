import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

const ResourceManagement = () => {
  const [resources, setResources] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [staff, setStaff] = useState([]);
  const [formData, setFormData] = useState({
    resourceId: '',
    resourceName: '',
    type: 'Equipment',
    quantity: '',
    department: '',
    allocatedTo: '',
    status: 'Available',
  });

  useEffect(() => {
    fetchResources();
    fetchStaff();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await fetch(`${API_URL}/resources`);
      const data = await response.json();
      setResources(data);
    } catch (error) {
      console.error('Error fetching resources:', error);
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
      const url = editingId ? `${API_URL}/resources/${editingId}` : `${API_URL}/resources`;
      const method = editingId ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...formData, quantity: parseInt(formData.quantity)}),
      });
      
      if (response.ok) {
        fetchResources();
        setFormData({ resourceId: '', resourceName: '', type: 'Equipment', quantity: '', department: '', allocatedTo: '', status: 'Available' });
        setEditingId(null);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error saving resource:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this resource?')) {
      try {
        await fetch(`${API_URL}/resources/${id}`, { method: 'DELETE' });
        fetchResources();
      } catch (error) {
        console.error('Error deleting resource:', error);
      }
    }
  };

  const handleEdit = (resource) => {
    setFormData(resource);
    setEditingId(resource._id);
    setShowForm(true);
  };

  return (
    <div style={styles.container}>
      <h2>Resource Allocation Management</h2>
      <p style={styles.subtitle}>Manage equipment, software licenses, and resources</p>
      <button onClick={() => setShowForm(!showForm)} style={styles.button}>
        {showForm ? 'Cancel' : 'Add New Resource'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <input type="text" placeholder="Resource ID" value={formData.resourceId} onChange={(e) => setFormData({...formData, resourceId: e.target.value})} required style={styles.input} />
          <input type="text" placeholder="Resource Name" value={formData.resourceName} onChange={(e) => setFormData({...formData, resourceName: e.target.value})} required style={styles.input} />
          <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} style={styles.input}>
            <option>Equipment</option>
            <option>Software License</option>
            <option>Digital Resource</option>
            <option>Physical Asset</option>
          </select>
          <input type="number" placeholder="Quantity" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} required style={styles.input} />
          <input type="text" placeholder="Department" value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} required style={styles.input} />
          <select value={formData.allocatedTo} onChange={(e) => setFormData({...formData, allocatedTo: e.target.value})} style={styles.input}>
            <option value="">Allocate to (Optional)</option>
            {staff.map(s => <option key={s._id} value={s._id}>{s.firstName} {s.lastName}</option>)}
          </select>
          <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} style={styles.input}>
            <option>Available</option>
            <option>In Use</option>
            <option>Maintenance</option>
          </select>
          <button type="submit" style={styles.submitButton}>{editingId ? 'Update' : 'Create'} Resource</button>
        </form>
      )}

      <table style={styles.table}>
        <thead><tr style={styles.headerRow}>
          <th>ID</th><th>Name</th><th>Type</th><th>Qty</th><th>Department</th><th>Status</th><th>Actions</th>
        </tr></thead>
        <tbody>
          {resources.map(r => (
            <tr key={r._id}>
              <td>{r.resourceId}</td><td>{r.resourceName}</td><td>{r.type}</td><td>{r.quantity}</td><td>{r.department}</td><td>{r.status}</td>
              <td><button onClick={() => handleEdit(r)} style={styles.editBtn}>Edit</button><button onClick={() => handleDelete(r._id)} style={styles.deleteBtn}>Delete</button></td>
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

export default ResourceManagement;
