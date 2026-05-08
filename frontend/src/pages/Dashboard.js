import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/dashboard`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Dashboard</h2>
      {stats ? (
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.totalStudents}</div>
            <div style={styles.statLabel}>Total Students</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.totalCourses}</div>
            <div style={styles.statLabel}>Total Courses</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.totalStaff}</div>
            <div style={styles.statLabel}>Total Staff</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.totalRooms}</div>
            <div style={styles.statLabel}>Total Rooms</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.totalEnrollments}</div>
            <div style={styles.statLabel}>Total Enrollments</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.activeStudents}</div>
            <div style={styles.statLabel}>Active Students</div>
          </div>
        </div>
      ) : (
        <p>Loading statistics...</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginTop: '20px',
  },
  statCard: {
    backgroundColor: '#f5f5f5',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  statValue: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    color: '#666',
    marginTop: '10px',
    fontSize: '14px',
  },
};

export default Dashboard;
