import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    roomNumber: '',
    building: '',
    floor: '',
    capacity: '',
    type: 'Classroom',
    facilities: '',
  });

  useEffect(() => {
    fetchRooms();
  }, []);

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
      const url = editingId ? `${API_URL}/rooms/${editingId}` : `${API_URL}/rooms`;
      const method = editingId ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          capacity: parseInt(formData.capacity),
          floor: formData.floor ? parseInt(formData.floor) : null,
          facilities: formData.facilities.split(',').map(f => f.trim()).filter(f => f)
        }),
      });
      
      if (response.ok) {
        fetchRooms();
        setFormData({ roomNumber: '', building: '', floor: '', capacity: '', type: 'Classroom', facilities: '' });
        setEditingId(null);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error saving room:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await fetch(`${API_URL}/rooms/${id}`, { method: 'DELETE' });
        fetchRooms();
      } catch (error) {
        console.error('Error deleting room:', error);
      }
    }
  };

  const handleEdit = (room) => {
    setFormData({
      ...room,
      facilities: room.facilities ? room.facilities.join(', ') : ''
    });
    setEditingId(room._id);
    setShowForm(true);
  };

  return (
    <div style={styles.container}>
      <h2>Room Management</h2>
      <button onClick={() => setShowForm(!showForm)} style={styles.button}>
        {showForm ? 'Cancel' : 'Add New Room'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Room Number"
            value={formData.roomNumber}
            onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
            required
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Building"
            value={formData.building}
            onChange={(e) => setFormData({...formData, building: e.target.value})}
            required
            style={styles.input}
          />
          <input
            type="number"
            placeholder="Floor"
            value={formData.floor}
            onChange={(e) => setFormData({...formData, floor: e.target.value})}
            style={styles.input}
          />
          <input
            type="number"
            placeholder="Capacity"
            value={formData.capacity}
            onChange={(e) => setFormData({...formData, capacity: e.target.value})}
            required
            style={styles.input}
          />
          <select
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
            style={styles.input}
          >
            <option>Classroom</option>
            <option>Lab</option>
            <option>Auditorium</option>
            <option>Seminar</option>
          </select>
          <input
            type="text"
            placeholder="Facilities (comma separated)"
            value={formData.facilities}
            onChange={(e) => setFormData({...formData, facilities: e.target.value})}
            style={styles.input}
          />
          <button type="submit" style={styles.submitButton}>
            {editingId ? 'Update' : 'Create'} Room
          </button>
        </form>
      )}

      <table style={styles.table}>
        <thead>
          <tr style={styles.headerRow}>
            <th>Room Number</th>
            <th>Building</th>
            <th>Type</th>
            <th>Capacity</th>
            <th>Available</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map(room => (
            <tr key={room._id}>
              <td>{room.roomNumber}</td>
              <td>{room.building}</td>
              <td>{room.type}</td>
              <td>{room.capacity}</td>
              <td>{room.isAvailable ? 'Yes' : 'No'}</td>
              <td>
                <button onClick={() => handleEdit(room)} style={styles.editBtn}>Edit</button>
                <button onClick={() => handleDelete(room._id)} style={styles.deleteBtn}>Delete</button>
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

export default RoomManagement;
