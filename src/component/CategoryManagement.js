import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import '../CategoryManagement.css';

const API_BASE = `${process.env.REACT_APP_API_URL}/categories`;

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(API_BASE);
      setCategories(res.data);
    } catch (err) {
      setError('Failed to fetch categories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async () => {
    if (!newCategory.trim()) {
      Swal.fire('Warning', 'Please enter a category name', 'warning');
      return;
    }
    try {
      await axios.post(API_BASE, { name: newCategory });
      setNewCategory('');
      fetchCategories();
      Swal.fire('Success', 'Category added successfully', 'success');
    } catch (err) {
      setError('Failed to add category');
      console.error(err.response?.data || err.message);
    }
  };

  const startEdit = (cat) => {
    setEditCategoryId(cat.id);
    setEditCategoryName(cat.name);
  };

  const cancelEdit = () => {
    setEditCategoryId(null);
    setEditCategoryName('');
  };

  const saveEdit = async () => {
    if (!editCategoryName.trim()) {
      Swal.fire('Warning', 'Category name cannot be empty', 'warning');
      return;
    }
    try {
      await axios.put(`${API_BASE}/${editCategoryId}`, { name: editCategoryName });
      setEditCategoryId(null);
      setEditCategoryName('');
      fetchCategories();
      Swal.fire('Success', 'Category updated successfully', 'success');
    } catch (err) {
      setError('Failed to update category');
      console.error(err.response?.data || err.message);
    }
  };

  const deleteCategory = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this category!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${API_BASE}/${id}`);
        fetchCategories();
        Swal.fire('Deleted!', 'Category has been deleted.', 'success');
      } catch (err) {
        setError('Failed to delete category');
        console.error(err.response?.data || err.message);
      }
    }
  };

  return (
    <div className="category-container">
      <h2>Category Management</h2>

      {/* Add new category */}
      <div className="category-form">
        <input
          type="text"
          value={newCategory}
          placeholder="Enter new category name"
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button onClick={addCategory}>Add Category</button>
      </div>

      {loading && <p>Loading categories...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <table className="category-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th style={{ minWidth: '180px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan="3">No categories found.</td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id}>
                  <td>{cat.id}</td>
                  <td>
                    {editCategoryId === cat.id ? (
                      <input
                        type="text"
                        value={editCategoryName}
                        onChange={(e) => setEditCategoryName(e.target.value)}
                      />
                    ) : (
                      cat.name
                    )}
                  </td>
                  <td>
                    {editCategoryId === cat.id ? (
                      <>
                        <button onClick={saveEdit} style={{ marginRight: '8px' }}>
                          Save
                        </button>
                        <button onClick={cancelEdit}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(cat)}
                          style={{ marginRight: '8px' }}
                          aria-label="Edit Category"
                        >
                          <FiEdit size={18} />
                        </button>
                        <button onClick={() => deleteCategory(cat.id)} aria-label="Delete Category">
                          <FiTrash2 size={18} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CategoryManagement;
