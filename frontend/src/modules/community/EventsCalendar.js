import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

const EventsCalendar = () => {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [staff, setStaff] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    eventId: '',
    title: '',
    description: '',
    eventType: 'Academic',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    organizer: '',
    expectedAttendees: '',
    status: 'Upcoming',
    isPublic: true,
  });

  useEffect(() => {
    fetchEvents();
    fetchStaff();
    fetchRooms();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API_URL}/events`);
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
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
      const url = editingId ? `${API_URL}/events/${editingId}` : `${API_URL}/events`;
      const method = editingId ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...formData, expectedAttendees: parseInt(formData.expectedAttendees) || 0}),
      });
      
      if (response.ok) {
        fetchEvents();
        setFormData({ eventId: '', title: '', description: '', eventType: 'Academic', date: '', startTime: '', endTime: '', location: '', organizer: '', expectedAttendees: '', status: 'Upcoming', isPublic: true });
        setEditingId(null);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this event?')) {
      try {
        await fetch(`${API_URL}/events/${id}`, { method: 'DELETE' });
        fetchEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const handleEdit = (event) => {
    setFormData(event);
    setEditingId(event._id);
    setShowForm(true);
  };

  const getStatusColor = (status) => {
    const colors = { Upcoming: '#0066cc', Ongoing: '#ff9900', Completed: '#28a745', Cancelled: '#dc3545' };
    return colors[status] || '#666';
  };

  return (
    <div style={styles.container}>
      <h2>Events Calendar</h2>
      <p style={styles.subtitle}>Manage university events and activities</p>
      <button onClick={() => setShowForm(!showForm)} style={styles.button}>
        {showForm ? 'Cancel' : 'Create Event'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <input type="text" placeholder="Event ID" value={formData.eventId} onChange={(e) => setFormData({...formData, eventId: e.target.value})} required style={styles.input} />
          <input type="text" placeholder="Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required style={styles.input} />
          <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} style={{...styles.input, minHeight: '80px'}} />
          <select value={formData.eventType} onChange={(e) => setFormData({...formData, eventType: e.target.value})} style={styles.input}>
            <option>Academic</option><option>Sports</option><option>Cultural</option><option>Seminar</option><option>Workshop</option><option>Conference</option>
          </select>
          <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required style={styles.input} />
          <input type="time" placeholder="Start Time" value={formData.startTime} onChange={(e) => setFormData({...formData, startTime: e.target.value})} style={styles.input} />
          <input type="time" placeholder="End Time" value={formData.endTime} onChange={(e) => setFormData({...formData, endTime: e.target.value})} style={styles.input} />
          <input type="text" placeholder="Location" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} style={styles.input} />
          <select value={formData.organizer} onChange={(e) => setFormData({...formData, organizer: e.target.value})} required style={styles.input}>
            <option value="">Select Organizer</option>
            {staff.map(s => <option key={s._id} value={s._id}>{s.firstName} {s.lastName}</option>)}
          </select>
          <input type="number" placeholder="Expected Attendees" value={formData.expectedAttendees} onChange={(e) => setFormData({...formData, expectedAttendees: e.target.value})} style={styles.input} />
          <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} style={styles.input}>
            <option>Upcoming</option><option>Ongoing</option><option>Completed</option><option>Cancelled</option>
          </select>
          <label style={{marginBottom: '10px'}}>
            <input type="checkbox" checked={formData.isPublic} onChange={(e) => setFormData({...formData, isPublic: e.target.checked})} />
            {' '}Public Event
          </label>
          <button type="submit" style={styles.submitButton}>{editingId ? 'Update' : 'Create'} Event</button>
        </form>
      )}

      <table style={styles.table}>
        <thead><tr style={styles.headerRow}>
          <th>ID</th><th>Title</th><th>Type</th><th>Date</th><th>Time</th><th>Status</th><th>Attendees</th><th>Actions</th>
        </tr></thead>
        <tbody>
          {events.map(e => (
            <tr key={e._id}>
              <td>{e.eventId}</td><td>{e.title}</td><td>{e.eventType}</td>
              <td>{new Date(e.date).toLocaleDateString()}</td><td>{e.startTime} - {e.endTime}</td>
              <td style={{color: getStatusColor(e.status), fontWeight: 'bold'}}>{e.status}</td>
              <td>{e.registeredAttendees}/{e.expectedAttendees}</td>
              <td><button onClick={() => handleEdit(e)} style={styles.editBtn}>Edit</button><button onClick={() => handleDelete(e._id)} style={styles.deleteBtn}>Delete</button></td>
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

export default EventsCalendar;
