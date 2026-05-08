import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

const PayrollManagement = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [staff, setStaff] = useState([]);
  const [formData, setFormData] = useState({
    payrollId: '',
    staff: '',
    paymentMonth: '',
    baseSalary: '',
    allowances: '0',
    deductions: '0',
    bonusAmount: '0',
    taxDeduction: '0',
    paymentStatus: 'Pending',
  });

  useEffect(() => {
    fetchPayrolls();
    fetchStaff();
  }, []);

  const fetchPayrolls = async () => {
    try {
      const response = await fetch(`${API_URL}/payroll`);
      const data = await response.json();
      setPayrolls(data);
    } catch (error) {
      console.error('Error fetching payroll:', error);
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

  const calculateNetSalary = () => {
    const base = parseFloat(formData.baseSalary) || 0;
    const allow = parseFloat(formData.allowances) || 0;
    const deduct = parseFloat(formData.deductions) || 0;
    const bonus = parseFloat(formData.bonusAmount) || 0;
    const tax = parseFloat(formData.taxDeduction) || 0;
    return base + allow + bonus - deduct - tax;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId ? `${API_URL}/payroll/${editingId}` : `${API_URL}/payroll`;
      const method = editingId ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          baseSalary: parseFloat(formData.baseSalary),
          allowances: parseFloat(formData.allowances),
          deductions: parseFloat(formData.deductions),
          bonusAmount: parseFloat(formData.bonusAmount),
          taxDeduction: parseFloat(formData.taxDeduction),
          netSalary: calculateNetSalary()
        }),
      });
      
      if (response.ok) {
        fetchPayrolls();
        setFormData({ payrollId: '', staff: '', paymentMonth: '', baseSalary: '', allowances: '0', deductions: '0', bonusAmount: '0', taxDeduction: '0', paymentStatus: 'Pending' });
        setEditingId(null);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error saving payroll:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this payroll record?')) {
      try {
        await fetch(`${API_URL}/payroll/${id}`, { method: 'DELETE' });
        fetchPayrolls();
      } catch (error) {
        console.error('Error deleting payroll:', error);
      }
    }
  };

  const handleEdit = (payroll) => {
    setFormData(payroll);
    setEditingId(payroll._id);
    setShowForm(true);
  };

  return (
    <div style={styles.container}>
      <h2>Payroll Management</h2>
      <p style={styles.subtitle}>Manage staff payroll and compensation</p>
      <button onClick={() => setShowForm(!showForm)} style={styles.button}>
        {showForm ? 'Cancel' : 'New Payroll Entry'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <input type="text" placeholder="Payroll ID" value={formData.payrollId} onChange={(e) => setFormData({...formData, payrollId: e.target.value})} required style={styles.input} />
          <select value={formData.staff} onChange={(e) => setFormData({...formData, staff: e.target.value})} required style={styles.input}>
            <option value="">Select Staff Member</option>
            {staff.map(s => <option key={s._id} value={s._id}>{s.firstName} {s.lastName}</option>)}
          </select>
          <input type="month" value={formData.paymentMonth} onChange={(e) => setFormData({...formData, paymentMonth: e.target.value})} required style={styles.input} />
          <input type="number" placeholder="Base Salary" value={formData.baseSalary} onChange={(e) => setFormData({...formData, baseSalary: e.target.value})} required style={styles.input} />
          <input type="number" placeholder="Allowances" value={formData.allowances} onChange={(e) => setFormData({...formData, allowances: e.target.value})} style={styles.input} />
          <input type="number" placeholder="Deductions" value={formData.deductions} onChange={(e) => setFormData({...formData, deductions: e.target.value})} style={styles.input} />
          <input type="number" placeholder="Bonus Amount" value={formData.bonusAmount} onChange={(e) => setFormData({...formData, bonusAmount: e.target.value})} style={styles.input} />
          <input type="number" placeholder="Tax Deduction" value={formData.taxDeduction} onChange={(e) => setFormData({...formData, taxDeduction: e.target.value})} style={styles.input} />
          <select value={formData.paymentStatus} onChange={(e) => setFormData({...formData, paymentStatus: e.target.value})} style={styles.input}>
            <option>Pending</option><option>Processed</option><option>Paid</option>
          </select>
          <div style={{...styles.input, backgroundColor: '#e8f5e9', padding: '10px', borderRadius: '4px', marginBottom: '10px'}}>
            <strong>Net Salary: </strong>${calculateNetSalary().toFixed(2)}
          </div>
          <button type="submit" style={styles.submitButton}>{editingId ? 'Update' : 'Create'} Payroll Entry</button>
        </form>
      )}

      <table style={styles.table}>
        <thead><tr style={styles.headerRow}>
          <th>ID</th><th>Staff</th><th>Month</th><th>Base</th><th>Net</th><th>Status</th><th>Actions</th>
        </tr></thead>
        <tbody>
          {payrolls.map(p => (
            <tr key={p._id}>
              <td>{p.payrollId}</td><td>{p.staff?.firstName} {p.staff?.lastName}</td>
              <td>{new Date(p.paymentMonth).toLocaleDateString('en-US', {year: 'numeric', month: 'short'})}</td>
              <td>${p.baseSalary.toFixed(2)}</td><td>${p.netSalary.toFixed(2)}</td><td>{p.paymentStatus}</td>
              <td><button onClick={() => handleEdit(p)} style={styles.editBtn}>Edit</button><button onClick={() => handleDelete(p._id)} style={styles.deleteBtn}>Delete</button></td>
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

export default PayrollManagement;
