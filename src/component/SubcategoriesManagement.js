import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import '../SubcategoriesManagement.css';

const SubcategoriesManagement = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newSubcategory, setNewSubcategory] = useState({
    name: '',
    category_id: '',
  });

  const [editSubcategoryId, setEditSubcategoryId] = useState(null);
  const [editSubcategory, setEditSubcategory] = useState({
    name: '',
    category_id: '',
  });

  useEffect(() => {
    fetchSubcategories();
    fetchCategories();
  }, []);

  const fetchSubcategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/subcategories');
      setSubcategories(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleAddSubcategory = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/subcategories', newSubcategory);
      setNewSubcategory({ name: '', category_id: '' });
      fetchSubcategories();
      Swal.fire('Success', 'Subcategory added successfully', 'success');
    } catch (error) {
      console.error('Error adding subcategory:', error);
      Swal.fire('Error', 'Failed to add subcategory', 'error');
    }
  };

  const startEdit = (subcat) => {
    setEditSubcategoryId(subcat.id);
    setEditSubcategory({
      name: subcat.subcategory_name,
      category_id: categories.find((cat) => cat.name === subcat.category_name)?.id || '',
    });
  };

  const cancelEdit = () => {
    setEditSubcategoryId(null);
    setEditSubcategory({ name: '', category_id: '' });
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(`http://localhost:5000/api/subcategories/${editSubcategoryId}`, editSubcategory);
      fetchSubcategories();
      setEditSubcategoryId(null);
      setEditSubcategory({ name: '', category_id: '' });
      Swal.fire('Success', 'Subcategory updated successfully', 'success');
    } catch (error) {
      console.error('Error updating subcategory:', error);
      Swal.fire('Error', 'Failed to update subcategory', 'error');
    }
  };

  const deleteSubcategory = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this subcategory!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/subcategories/${id}`);
        fetchSubcategories();
        Swal.fire('Deleted!', 'Subcategory has been deleted.', 'success');
      } catch (error) {
        console.error('Error deleting subcategory:', error);
        Swal.fire('Error', 'Failed to delete subcategory', 'error');
      }
    }
  };

  return (
    <div className="subcategory-container">
      <h2 className="title">Subcategories Management</h2>

      {/* Add Form */}
      <form onSubmit={handleAddSubcategory} className="form-container">
        <h3 className="form-title">Add New Subcategory</h3>
        <div className="form-fields">
          <input
            type="text"
            placeholder="Subcategory Name"
            className="input-field"
            value={newSubcategory.name}
            onChange={(e) => setNewSubcategory({ ...newSubcategory, name: e.target.value })}
            required
          />
          <select
            className="input-field"
            value={newSubcategory.category_id}
            onChange={(e) => setNewSubcategory({ ...newSubcategory, category_id: e.target.value })}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <button type="submit" className="btn btn-add">Add</button>
        </div>
      </form>

      {/* Table */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="subcategory-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Subcategory Name</th>
              <th>Category Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subcategories.map((subcat) => (
              <tr key={subcat.id}>
                <td>{subcat.id}</td>
                <td>
                  {editSubcategoryId === subcat.id ? (
                    <input
                      type="text"
                      value={editSubcategory.name}
                      onChange={(e) =>
                        setEditSubcategory({ ...editSubcategory, name: e.target.value })
                      }
                    />
                  ) : (
                    subcat.subcategory_name
                  )}
                </td>
                <td>
                  {editSubcategoryId === subcat.id ? (
                    <select
                      value={editSubcategory.category_id}
                      onChange={(e) =>
                        setEditSubcategory({ ...editSubcategory, category_id: e.target.value })
                      }
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    subcat.category_name
                  )}
                </td>
                <td>
                  {editSubcategoryId === subcat.id ? (
                    <>
                      <button className="icon-button" onClick={handleEditSubmit} aria-label="Save">
                        ✅
                      </button>
                      <button className="icon-button" onClick={cancelEdit} aria-label="Cancel">
                        ❌
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="icon-button"
                        onClick={() => startEdit(subcat)}
                        aria-label="Edit Subcategory"
                      >
                        <FiEdit size={18} />
                      </button>
                      <button
                        className="icon-button"
                        onClick={() => deleteSubcategory(subcat.id)}
                        aria-label="Delete Subcategory"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SubcategoriesManagement;
