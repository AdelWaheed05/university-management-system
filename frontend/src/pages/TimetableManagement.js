import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

const TimetableManagement = () => {
  const [timetables, setTimetables] = useState([]);
  const [courses, setCourses] = useState([]);
  const [staff, setStaff] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    course: '',
    instructor: '',
    room: '',
    dayOfWeek: 'Monday',
    startTime: '',
    endTime: '',
    semester: '',
  });

  useEffect(() => {
    fetchTimetables();
    fetchCourses();
    fetchStaff();
    fetchRooms();
  }, []);

  const fetchTimetables = async () => {
    try {
      const response = await fetch(`${API_URL}/timetables`);
      const data = await response.json();
      setTimetables(data);
    } catch (error) {
      console.error('Error fetching timetables:', error);
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
      const url = editingId ? `${API_URL}/timetables/${editingId}` : `${API_URL}/timetables`;
      const method = editingId ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        fetchTimetables();
        setFormData({ course: '', instructor: '', room: '', dayOfWeek: 'Monday', startTime: '', endTime: '', semester: '' });
        setEditingId(null);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error saving timetable:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await fetch(`${API_URL}/timetables/${id}`, { method: 'DELETE' });
        fetchTimetables();
      } catch (error) {
        console.error('Error deleting timetable:', error);
      }
    }
  };

  const handleEdit = (timetable) => {
    setFormData(timetable);
    setEditingId(timetable._id);
    setShowForm(true);
  };

  const getCourseName = (id) => {
    const course = courses.find(c => c._id === id);
    return course ? course.title : 'Unknown';
  };

  const getInstructorName = (id) => {
    const instructor = staff.find(s => s._id === id);
    return instructor ? `${instructor.firstName} ${instructor.lastName}` : 'Unknown';
  };

  const getRoomNumber = (id) => {
    const room = rooms.find(r => r._id === id);
    return room ? room.roomNumber : 'Unknown';
  };

  return (
    <div style={styles.container}>
      <h2>Timetable Management</h2>
      <button onClick={() => setShowForm(!showForm)} style={styles.button}>
        {showForm ? 'Cancel' : 'Add New Timetable Entry'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <select
            value={formData.course}
            onChange={(e) => setFormData({...formData, course: e.target.value})}
            required
            style={styles.input}
          >
            <option value="">Select Course</option>
            {courses.map(course => (
              <option key={course._id} value={course._id}>
                {course.code} - {course.title}
              </option>
            ))}
          </select>
          <select
            value={formData.instructor}
            onChange={(e) => setFormData({...formData, instructor: e.target.value})}
            required
            style={styles.input}
          >
            <option value="">Select Instructor</option>
            {staff.map(s => (
              <option key={s._id} value={s._id}>
                {s.firstName} {s.lastName}
              </option>
            ))}
          </select>
          <select
            value={formData.room}
            onChange={(e) => setFormData({...formData, room: e.target.value})}
            required
            style={styles.input}
          >
            <option value="">Select Room</option>
            {rooms.map(room => (
              <option key={room._id} value={room._id}>
                {room.roomNumber} - {room.building}
              </option>
            ))}
          </select>
          <select
            value={formData.dayOfWeek}
            onChange={(e) => setFormData({...formData, dayOfWeek: e.target.value})}
            style={styles.input}
          >
            <option>Monday</option>
            <option>Tuesday</option>
            <option>Wednesday</option>
            <option>Thursday</option>
            <option>Friday</option>
          </select>
          <input
            type="time"
            value={formData.startTime}
            onChange={(e) => setFormData({...formData, startTime: e.target.value})}
            required
            style={styles.input}
          />
          <input
            type="time"
            value={formData.endTime}
            onChange={(e) => setFormData({...formData, endTime: e.target.value})}
            required
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Semester (e.g., Fall 2024)"
            value={formData.semester}
            onChange={(e) => setFormData({...formData, semester: e.target.value})}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.submitButton}>
            {editingId ? 'Update' : 'Create'} Timetable Entry
          </button>
        </form>
      )}

      <table style={styles.table}>
        <thead>
          <tr style={styles.headerRow}>
            <th>Course</th>
            <th>Instructor</th>
            <th>Room</th>
            <th>Day</th>
            <th>Time</th>
            <th>Semester</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {timetables.map(entry => (
            <tr key={entry._id}>
              <td>{getCourseName(entry.course)}</td>
              <td>{getInstructorName(entry.instructor)}</td>
              <td>{getRoomNumber(entry.room)}</td>
              <td>{entry.dayOfWeek}</td>
              <td>{entry.startTime} - {entry.endTime}</td>
              <td>{entry.semester}</td>
              <td>
                <button onClick={() => handleEdit(entry)} style={styles.editBtn}>Edit</button>
                <button onClick={() => handleDelete(entry._id)} style={styles.deleteBtn}>Delete</button>
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

export default TimetableManagement;
