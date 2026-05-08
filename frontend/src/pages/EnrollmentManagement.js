import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

const EnrollmentManagement = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    student: '',
    course: '',
    grade: 'Pending',
    status: 'Active',
  });

  useEffect(() => {
    fetchEnrollments();
    fetchStudents();
    fetchCourses();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const response = await fetch(`${API_URL}/enrollments`);
      const data = await response.json();
      setEnrollments(data);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
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
      const url = editingId ? `${API_URL}/enrollments/${editingId}` : `${API_URL}/enrollments`;
      const method = editingId ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        fetchEnrollments();
        setFormData({ student: '', course: '', grade: 'Pending', status: 'Active' });
        setEditingId(null);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error saving enrollment:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await fetch(`${API_URL}/enrollments/${id}`, { method: 'DELETE' });
        fetchEnrollments();
      } catch (error) {
        console.error('Error deleting enrollment:', error);
      }
    }
  };

  const handleEdit = (enrollment) => {
    setFormData(enrollment);
    setEditingId(enrollment._id);
    setShowForm(true);
  };

  const getStudentName = (id) => {
    const student = students.find(s => s._id === id);
    return student ? `${student.firstName} ${student.lastName}` : 'Unknown';
  };

  const getCourseName = (id) => {
    const course = courses.find(c => c._id === id);
    return course ? course.title : 'Unknown';
  };

  return (
    <div style={styles.container}>
      <h2>Enrollment Management</h2>
      <button onClick={() => setShowForm(!showForm)} style={styles.button}>
        {showForm ? 'Cancel' : 'Add New Enrollment'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <select
            value={formData.student}
            onChange={(e) => setFormData({...formData, student: e.target.value})}
            required
            style={styles.input}
          >
            <option value="">Select Student</option>
            {students.map(student => (
              <option key={student._id} value={student._id}>
                {student.firstName} {student.lastName}
              </option>
            ))}
          </select>
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
            value={formData.grade}
            onChange={(e) => setFormData({...formData, grade: e.target.value})}
            style={styles.input}
          >
            <option>Pending</option>
            <option>A</option>
            <option>B</option>
            <option>C</option>
            <option>D</option>
            <option>F</option>
          </select>
          <select
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
            style={styles.input}
          >
            <option>Active</option>
            <option>Dropped</option>
            <option>Completed</option>
          </select>
          <button type="submit" style={styles.submitButton}>
            {editingId ? 'Update' : 'Create'} Enrollment
          </button>
        </form>
      )}

      <table style={styles.table}>
        <thead>
          <tr style={styles.headerRow}>
            <th>Student</th>
            <th>Course</th>
            <th>Grade</th>
            <th>Status</th>
            <th>Enrollment Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {enrollments.map(enrollment => (
            <tr key={enrollment._id}>
              <td>{getStudentName(enrollment.student)}</td>
              <td>{getCourseName(enrollment.course)}</td>
              <td>{enrollment.grade}</td>
              <td>{enrollment.status}</td>
              <td>{new Date(enrollment.enrollmentDate).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleEdit(enrollment)} style={styles.editBtn}>Edit</button>
                <button onClick={() => handleDelete(enrollment._id)} style={styles.deleteBtn}>Delete</button>
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

export default EnrollmentManagement;
