import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

const Messaging = () => {
  const [messages, setMessages] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [staff, setStaff] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [formData, setFormData] = useState({
    messageId: '',
    sender: '',
    receiver: '',
    subject: '',
    content: '',
    type: 'General',
  });

  useEffect(() => {
    fetchMessages();
    fetchStaff();
    fetchStudents();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`${API_URL}/messages`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
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
      const url = editingId ? `${API_URL}/messages/${editingId}` : `${API_URL}/messages`;
      const method = editingId ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...formData, timestamp: new Date()}),
      });
      
      if (response.ok) {
        fetchMessages();
        setFormData({ messageId: '', sender: '', receiver: '', subject: '', content: '', type: 'General' });
        setEditingId(null);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this message?')) {
      try {
        await fetch(`${API_URL}/messages/${id}`, { method: 'DELETE' });
        fetchMessages();
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    }
  };

  const handleEdit = (message) => {
    setFormData(message);
    setEditingId(message._id);
    setShowForm(true);
  };

  const groupedMessages = messages.reduce((acc, msg) => {
    const key = `${msg.sender?._id}-${msg.receiver?._id}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(msg);
    return acc;
  }, {});

  return (
    <div style={styles.container}>
      <h2>Messaging System</h2>
      <p style={styles.subtitle}>Direct communication between students and staff</p>
      <button onClick={() => setShowForm(!showForm)} style={styles.button}>
        {showForm ? 'Cancel' : 'Send Message'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <input type="text" placeholder="Message ID" value={formData.messageId} onChange={(e) => setFormData({...formData, messageId: e.target.value})} required style={styles.input} />
          <select value={formData.sender} onChange={(e) => setFormData({...formData, sender: e.target.value})} required style={styles.input}>
            <option value="">From (Sender)</option>
            {staff.map(s => <option key={s._id} value={s._id}>Staff: {s.firstName} {s.lastName}</option>)}
            {students.map(st => <option key={st._id} value={st._id}>Student: {st.firstName} {st.lastName}</option>)}
          </select>
          <select value={formData.receiver} onChange={(e) => setFormData({...formData, receiver: e.target.value})} required style={styles.input}>
            <option value="">To (Receiver)</option>
            {staff.map(s => <option key={s._id} value={s._id}>Staff: {s.firstName} {s.lastName}</option>)}
            {students.map(st => <option key={st._id} value={st._id}>Student: {st.firstName} {st.lastName}</option>)}
          </select>
          <input type="text" placeholder="Subject" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} style={styles.input} />
          <textarea placeholder="Message Content" value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} required style={{...styles.input, minHeight: '100px'}} />
          <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} style={styles.input}>
            <option>General</option><option>Academic</option><option>Administrative</option><option>Urgent</option>
          </select>
          <button type="submit" style={styles.submitButton}>{editingId ? 'Update' : 'Send'} Message</button>
        </form>
      )}

      <div style={styles.messagingLayout}>
        <div style={styles.conversationList}>
          <h3>Conversations</h3>
          {Object.entries(groupedMessages).map(([key, msgs]) => (
            <div key={key} onClick={() => setSelectedConversation(msgs)} style={{...styles.conversationItem, backgroundColor: selectedConversation === msgs ? '#e3f2fd' : 'white'}}>
              <strong>{msgs[0].sender?.firstName} ↔ {msgs[0].receiver?.firstName}</strong>
              <small>{msgs.length} messages</small>
            </div>
          ))}
        </div>
        <div style={styles.messageThreads}>
          {selectedConversation ? (
            <div>
              {selectedConversation.map(m => (
                <div key={m._id} style={styles.messageCard}>
                  <strong>{m.sender?.firstName} to {m.receiver?.firstName}</strong>
                  <p><strong>Subject:</strong> {m.subject}</p>
                  <p>{m.content}</p>
                  <small>{new Date(m.timestamp).toLocaleString()}</small>
                  <div style={styles.messageActions}>
                    <button onClick={() => handleEdit(m)} style={styles.editBtn}>Edit</button>
                    <button onClick={() => handleDelete(m._id)} style={styles.deleteBtn}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{textAlign: 'center', color: '#999'}}>Select a conversation to view messages</p>
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
  messagingLayout: { display: 'grid', gridTemplateColumns: '250px 1fr', gap: '20px', marginTop: '20px' },
  conversationList: { backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '4px', height: 'fit-content' },
  conversationItem: { padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', userSelect: 'none' },
  messageThreads: { display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '4px' },
  messageCard: { backgroundColor: 'white', padding: '15px', borderRadius: '4px', borderLeft: '3px solid #007bff' },
  messageActions: { display: 'flex', gap: '10px', marginTop: '10px' },
  editBtn: { padding: '5px 10px', cursor: 'pointer', backgroundColor: '#ffc107', border: 'none', borderRadius: '3px', flex: 1 },
  deleteBtn: { padding: '5px 10px', cursor: 'pointer', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', flex: 1 },
};

export default Messaging;
