import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

const AnnouncementsBoard = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [staff, setStaff] = useState([]);
  const [formData, setFormData] = useState({
    announcementId: '',
    title: '',
    content: '',
    category: 'General',
    priority: 'Medium',
    postedBy: '',
    targetAudience: 'All',
  });

  useEffect(() => {
    fetchAnnouncements();
    fetchStaff();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch(`${API_URL}/announcements`);
      const data = await response.json();
      setAnnouncements(data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
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
      const url = editingId ? `${API_URL}/announcements/${editingId}` : `${API_URL}/announcements`;
      const method = editingId ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...formData, postedDate: new Date()}),
      });
      
      if (response.ok) {
        fetchAnnouncements();
        setFormData({ announcementId: '', title: '', content: '', category: 'General', priority: 'Medium', postedBy: '', targetAudience: 'All' });
        setEditingId(null);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error saving announcement:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this announcement?')) {
      try {
        await fetch(`${API_URL}/announcements/${id}`, { method: 'DELETE' });
        fetchAnnouncements();
      } catch (error) {
        console.error('Error deleting announcement:', error);
      }
    }
  };

  const handleEdit = (announcement) => {
    setFormData(announcement);
    setEditingId(announcement._id);
    setShowForm(true);
  };

  const getPriorityColor = (priority) => {
    const colors = { Low: '#28a745', Medium: '#ffc107', High: '#fd7e14', Critical: '#dc3545' };
    return colors[priority] || '#666';
  };

  return (
    <div style={styles.container}>
      <h2>Announcements Board</h2>
      <p style={styles.subtitle}>University-wide announcements and important deadlines</p>
      <button onClick={() => setShowForm(!showForm)} style={styles.button}>
        {showForm ? 'Cancel' : 'Post Announcement'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <input type="text" placeholder="Announcement ID" value={formData.announcementId} onChange={(e) => setFormData({...formData, announcementId: e.target.value})} required style={styles.input} />
          <input type="text" placeholder="Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required style={styles.input} />
          <textarea placeholder="Content" value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} required style={{...styles.input, minHeight: '100px'}} />
          <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} style={styles.input}>
            <option>Academic</option><option>Administrative</option><option>Event</option><option>Deadline</option><option>Maintenance</option><option>General</option>
          </select>
          <select value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})} style={styles.input}>
            <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
          </select>
          <select value={formData.postedBy} onChange={(e) => setFormData({...formData, postedBy: e.target.value})} required style={styles.input}>
            <option value="">Posted By (Staff)</option>
            {staff.map(s => <option key={s._id} value={s._id}>{s.firstName} {s.lastName}</option>)}
          </select>
          <select value={formData.targetAudience} onChange={(e) => setFormData({...formData, targetAudience: e.target.value})} style={styles.input}>
            <option>All</option><option>Students</option><option>Staff</option><option>Faculty</option><option>Specific Department</option>
          </select>
          <button type="submit" style={styles.submitButton}>{editingId ? 'Update' : 'Post'} Announcement</button>
        </form>
      )}

      <div style={styles.announcementsList}>
        {announcements.map(a => (
          <div key={a._id} style={{...styles.announcementCard, borderLeft: `4px solid ${getPriorityColor(a.priority)}`}}>
            <div style={styles.announcementHeader}>
              <h3>{a.title}</h3>
              <span style={{...styles.priorityBadge, backgroundColor: getPriorityColor(a.priority)}}>{a.priority}</span>
            </div>
            <p style={styles.announcementContent}>{a.content}</p>
            <div style={styles.announcementMeta}>
              <small>Category: {a.category} | Posted: {new Date(a.postedDate).toLocaleDateString()} | Views: {a.views}</small>
            </div>
            <div style={styles.announcementActions}>
              <button onClick={() => handleEdit(a)} style={styles.editBtn}>Edit</button>
              <button onClick={() => handleDelete(a._id)} style={styles.deleteBtn}>Delete</button>
            </div>
          </div>
        ))}
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
  announcementsList: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' },
  announcementCard: { backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  announcementHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  announcementContent: { color: '#333', marginBottom: '10px', lineHeight: '1.5' },
  announcementMeta: { color: '#999', fontSize: '12px', marginBottom: '10px' },
  announcementActions: { display: 'flex', gap: '10px' },
  priorityBadge: { color: 'white', padding: '4px 8px', borderRadius: '3px', fontSize: '12px' },
  editBtn: { padding: '5px 10px', cursor: 'pointer', backgroundColor: '#ffc107', border: 'none', borderRadius: '3px', flex: 1 },
  deleteBtn: { padding: '5px 10px', cursor: 'pointer', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', flex: 1 },
};

export default AnnouncementsBoard;
