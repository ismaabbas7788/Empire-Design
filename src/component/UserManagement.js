import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FiEdit, FiTrash } from 'react-icons/fi';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../UserManagement.css'; // Custom styles file

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [columns, setColumns] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    role: 'admin',
  });

  const [step, setStep] = useState('table');
  const [editUserId, setEditUserId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    fetchRegisterData();
  }, []);

  const fetchRegisterData = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/users`)
      .then((response) => {
        const data = response.data;
        if (data.columns && data.users) {
          setColumns(data.columns.map(col => ({ Header: col, accessor: col })));
          setUsers(data.users);
        }
      })
      .catch((error) => {
        console.error('Error fetching register data:', error);
      });
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`${process.env.REACT_APP_API_URL}/users`, formData)
      .then(() => {
        Swal.fire('Success', 'Admin added successfully', 'success');
        setFormData({ firstName: '', lastName: '', email: '', phone: '', password: '', role: 'admin' });
        fetchRegisterData();
        setStep('table');
      })
      .catch(() => {
        Swal.fire('Error', 'Failed to add record', 'error');
      });
  };

  const handleEditClick = (user) => {
    setEditUserId(user.id);
    setEditFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      password: user.password || '',
      role: user.role || 'user',
    });
    setStep('edit');
  };

  const handleEditChange = (e) => {
    setEditFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    axios.put(`${process.env.REACT_APP_API_URL}/users/${editUserId}`, editFormData)
      .then(() => {
        Swal.fire('Success', 'Record updated successfully', 'success');
        setEditUserId(null);
        setEditFormData({});
        fetchRegisterData();
        setStep('table');
      })
      .catch(() => {
        Swal.fire('Error', 'Failed to update record', 'error');
      });
  };

  const handleDeleteClick = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`${process.env.REACT_APP_API_URL}/users/${id}`)
          .then(() => {
            Swal.fire('Deleted!', 'Record deleted successfully.', 'success');
            fetchRegisterData();
          })
          .catch(() => {
            Swal.fire('Error', 'Failed to delete record', 'error');
          });
      }
    });
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">User Management</h2>

      {step === 'table' && (
        <>
          <div className="text-end mb-3">
            <button
              className="btn btn-success"
              onClick={() => {
                setFormData({
                  firstName: '',
                  lastName: '',
                  email: '',
                  phone: '',
                  password: '',
                  role: 'admin',
                });
                setStep('add');
              }}
            >
              Add Admin
            </button>
          </div>
          <table className="table table-bordered table-striped">
            <thead className="table-light">
              <tr>
                {columns.map(col => <th key={col.accessor}>{col.Header}</th>)}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.password}</td>
                  <td>{user.profileImage || '-'}</td>
                  <td>{user.role}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="icon-button" onClick={() => handleEditClick(user)}>
                        <FiEdit />
                      </button>
                      <button className="icon-button" onClick={() => handleDeleteClick(user.id)}>
                        <FiTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {(step === 'add' || step === 'edit') && (
        <form className="card p-4" onSubmit={step === 'add' ? handleSubmit : handleEditSubmit}>
          <h5 className="mb-3">{step === 'add' ? 'Add Admin' : 'Edit User'}</h5>
          <div className="row mb-3">
            <div className="col">
              <input
                type="text"
                className="form-control"
                name="firstName"
                placeholder="First Name"
                value={step === 'add' ? formData.firstName : editFormData.firstName}
                onChange={step === 'add' ? handleChange : handleEditChange}
                required
              />
            </div>
            <div className="col">
              <input
                type="text"
                className="form-control"
                name="lastName"
                placeholder="Last Name"
                value={step === 'add' ? formData.lastName : editFormData.lastName}
                onChange={step === 'add' ? handleChange : handleEditChange}
                required
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col">
              <input
                type="email"
                className="form-control"
                name="email"
                placeholder="Email"
                value={step === 'add' ? formData.email : editFormData.email}
                onChange={step === 'add' ? handleChange : handleEditChange}
                required
              />
            </div>
            <div className="col">
              <input
                type="text"
                className="form-control"
                name="phone"
                placeholder="Phone"
                value={step === 'add' ? formData.phone : editFormData.phone}
                onChange={step === 'add' ? handleChange : handleEditChange}
                required
              />
            </div>
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              name="password"
              placeholder="Password"
              value={step === 'add' ? formData.password : editFormData.password}
              onChange={step === 'add' ? handleChange : handleEditChange}
              required
            />
          </div>
          {step === 'edit' && (
            <div className="mb-3">
              <input type="text" className="form-control" value={editFormData.role} readOnly disabled />
            </div>
          )}
          <div className="d-flex justify-content-end gap-2">
            <button type="submit" className="btn btn-primary btn-fixed-width">{step === 'add' ? 'Submit' : 'Save'}</button>
            <button type="button" className="btn btn-secondary btn-fixed-width" onClick={() => setStep('table')}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}

export default UserManagement;
