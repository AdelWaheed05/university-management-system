import React, { useState } from 'react';
import './App.css';

// Facilities Module Pages
import ResourceManagement from './modules/facilities/ResourceManagement';
import MaintenanceTracking from './modules/facilities/MaintenanceTracking';

// Curriculum Module Pages
import AssignmentManagement from './modules/curriculum/AssignmentManagement';
import ExamManagement from './modules/curriculum/ExamManagement';
import LearningMaterialsManagement from './modules/curriculum/LearningMaterialsManagement';

// Staff Module Pages
import PerformanceTracking from './modules/staff/PerformanceTracking';
import LeaveManagement from './modules/staff/LeaveManagement';
import PayrollManagement from './modules/staff/PayrollManagement';

// Community Module Pages
import AnnouncementsBoard from './modules/community/AnnouncementsBoard';
import EventsCalendar from './modules/community/EventsCalendar';
import Messaging from './modules/community/Messaging';
import ParentPortal from './modules/community/ParentPortal';

function App() {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [activeComponent, setActiveComponent] = useState(null);

  const moduleConfig = {
    facilities: {
      name: 'Facilities Management',
      icon: '🏢',
      description: 'Manage rooms, resources, and maintenance',
      components: [
        { id: 'rooms', name: 'Room Management', component: null },
        { id: 'resources', name: 'Resource Allocation', component: <ResourceManagement /> },
        { id: 'maintenance', name: 'Maintenance Tracking', component: <MaintenanceTracking /> },
      ]
    },
    curriculum: {
      name: 'Curriculum Management',
      icon: '📚',
      description: 'Manage courses, assignments, and exams',
      components: [
        { id: 'assignments', name: 'Assignment Management', component: <AssignmentManagement /> },
        { id: 'exams', name: 'Exam Management', component: <ExamManagement /> },
        { id: 'materials', name: 'Learning Materials', component: <LearningMaterialsManagement /> },
      ]
    },
    staff: {
      name: 'Staff Management',
      icon: '👥',
      description: 'Manage staff, performance, and payroll',
      components: [
        { id: 'performance', name: 'Performance Tracking', component: <PerformanceTracking /> },
        { id: 'leaves', name: 'Leave Management', component: <LeaveManagement /> },
        { id: 'payroll', name: 'Payroll Management', component: <PayrollManagement /> },
      ]
    },
    community: {
      name: 'Community Hub',
      icon: '🤝',
      description: 'Announcements, events, and communications',
      components: [
        { id: 'announcements', name: 'Announcements', component: <AnnouncementsBoard /> },
        { id: 'events', name: 'Events Calendar', component: <EventsCalendar /> },
        { id: 'messaging', name: 'Messaging System', component: <Messaging /> },
        { id: 'parents', name: 'Parent Portal', component: <ParentPortal /> },
      ]
    }
  };

  const renderDashboard = () => {
    return (
      <div style={styles.dashboard}>
        <h1 style={styles.dashboardTitle}>University Management System</h1>
        <p style={styles.dashboardSubtitle}>Select a module to manage your institution</p>
        <div style={styles.moduleGrid}>
          {Object.entries(moduleConfig).map(([key, module]) => (
            <div key={key} style={styles.moduleCard} onClick={() => {
              setActiveModule(key);
              setActiveComponent(module.components[0].id);
            }}>
              <div style={styles.moduleIcon}>{module.icon}</div>
              <h3>{module.name}</h3>
              <p>{module.description}</p>
              <button style={styles.moduleButton}>Enter Module →</button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderModule = () => {
    const module = moduleConfig[activeModule];
    const currentComponent = module.components.find(c => c.id === activeComponent);

    return (
      <div style={styles.moduleView}>
        <div style={styles.header}>
          <button onClick={() => setActiveModule('dashboard')} style={styles.backButton}>← Dashboard</button>
          <h2 style={styles.moduleTitle}>{module.icon} {module.name}</h2>
        </div>

        <div style={styles.moduleContainer}>
          <div style={styles.sidebar}>
            <h3>Components</h3>
            {module.components.map(comp => (
              <button
                key={comp.id}
                onClick={() => setActiveComponent(comp.id)}
                style={{
                  ...styles.sidebarButton,
                  backgroundColor: activeComponent === comp.id ? '#007bff' : 'transparent',
                  color: activeComponent === comp.id ? 'white' : '#333'
                }}
              >
                {comp.name}
              </button>
            ))}
          </div>

          <div style={styles.content}>
            {currentComponent ? (
              currentComponent.component
            ) : (
              <div style={styles.placeholder}>
                <p>This component is coming soon</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.app}>
      <div style={styles.navbar}>
        <h1 style={styles.navbarBrand}>UMS</h1>
        <div style={styles.navbarMenu}>
          <span onClick={() => setActiveModule('dashboard')} style={styles.navbarItem}>Dashboard</span>
          <span style={styles.navbarItem}>v1.0 | University Management System</span>
        </div>
      </div>

      <div style={styles.mainContent}>
        {activeModule === 'dashboard' ? renderDashboard() : renderModule()}
      </div>

      <footer style={styles.footer}>
        <p>&copy; 2024 University Management System. All rights reserved.</p>
      </footer>
    </div>
  );
}

const styles = {
  app: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    fontFamily: 'Arial, sans-serif'
  },
  navbar: {
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '15px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  navbarBrand: {
    margin: 0,
    fontSize: '24px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  navbarMenu: {
    display: 'flex',
    gap: '30px',
    alignItems: 'center'
  },
  navbarItem: {
    cursor: 'pointer',
    fontSize: '14px',
    opacity: 0.9
  },
  mainContent: {
    flex: 1,
    padding: '30px',
    maxWidth: '1400px',
    margin: '0 auto',
    width: '100%'
  },
  dashboard: {
    textAlign: 'center'
  },
  dashboardTitle: {
    fontSize: '36px',
    color: '#2c3e50',
    marginBottom: '10px'
  },
  dashboardSubtitle: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '40px'
  },
  moduleGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px'
  },
  moduleCard: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'transform 0.2s, box-shadow 0.2s',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    }
  },
  moduleIcon: {
    fontSize: '48px',
    marginBottom: '15px'
  },
  moduleButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '15px',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  moduleView: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    overflow: 'hidden'
  },
  header: {
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '20px 30px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  backButton: {
    backgroundColor: '#34495e',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  moduleTitle: {
    margin: 0,
    fontSize: '24px'
  },
  moduleContainer: {
    display: 'grid',
    gridTemplateColumns: '220px 1fr',
    minHeight: '600px'
  },
  sidebar: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRight: '1px solid #ddd'
  },
  sidebarButton: {
    display: 'block',
    width: '100%',
    padding: '12px',
    marginBottom: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: 'white',
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: '14px',
    transition: 'all 0.2s'
  },
  content: {
    padding: '0',
    overflow: 'auto'
  },
  placeholder: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '400px',
    color: '#999',
    fontSize: '18px'
  },
  footer: {
    backgroundColor: '#2c3e50',
    color: 'white',
    textAlign: 'center',
    padding: '20px',
    marginTop: 'auto',
    fontSize: '14px'
  }
};

export default App;