import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import "../productmanagement.css";
import { FiEdit, FiTrash } from 'react-icons/fi';


const ProductSection = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState('');
  const [products, setProducts] = useState([]);
  const [productColumns, setProductColumns] = useState([]);
  const [newProductData, setNewProductData] = useState({});
  const [modalDescription, setModalDescription] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [currentStep, setCurrentStep] = useState('list'); // 'list' or 'form'

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/categories`)
      .then(res => setCategories(res.data))
      .catch(err => console.error('Failed to fetch categories', err));
  }, []);

  useEffect(() => {
    if (!selectedCategoryId) {
      setSubcategories([]);
      setSelectedSubcategoryId('');
      return;
    }
    axios.get(`${process.env.REACT_APP_API_URL}/categories/${selectedCategoryId}/subcategories`)
      .then(res => setSubcategories(res.data))
      .catch(err => console.error('Failed to fetch subcategories', err));
  }, [selectedCategoryId]);

  useEffect(() => {
    if (!selectedSubcategoryId) {
      setProducts([]);
      return;
    }
    axios.get(`${process.env.REACT_APP_API_URL}/products?subcategoryId=${selectedSubcategoryId}`)
      .then(res => setProducts(res.data))
      .catch(err => console.error('Failed to fetch products', err));
  }, [selectedSubcategoryId]);

const loadProductColumns = async () => {
  try {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/products/columns`);
    setProductColumns(res.data);

    const initialData = {};
res.data.forEach(col => {
  if (col.Extra !== 'auto_increment' && col.Field !== 'created_at') {
    initialData[col.Field] = '';
  }
});


    setNewProductData(initialData);
  } catch (err) {
    console.error('Failed to fetch product columns', err);
    throw err;
  }
};

  const handleAddProductClick = async () => {
    try {
      await loadProductColumns();
      setEditingProductId(null);
      setCurrentStep('form');
    } catch (err) {
      Swal.fire('Error', 'Could not load product form', 'error');
    }
  };

  const handleInputChange = (field, value) => {
    setNewProductData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productToSave = {
      ...newProductData,
      category_id: selectedCategoryId,
      subcategory_id: selectedSubcategoryId,
    };

    try {
      const url = editingProductId
        ? `${process.env.REACT_APP_API_URL}/products/${editingProductId}`
        : `${process.env.REACT_APP_API_URL}/products`;

      const method = editingProductId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productToSave),
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: editingProductId ? 'Product updated' : 'Product added',
          showConfirmButton: false,
          timer: 1500
        });

        setEditingProductId(null);
        setCurrentStep('list');

        const resetData = {};
        productColumns.forEach(col => {
          if (col.Extra !== 'auto_increment') resetData[col.Field] = '';
        });
        setNewProductData(resetData);

        axios.get(`${process.env.REACT_APP_API_URL}/products?subcategoryId=${selectedSubcategoryId}`)
          .then(res => setProducts(res.data));
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: result.message
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Request failed',
        text: error.message
      });
    }
  };

  const handleDescriptionClick = (description) => {
    setModalDescription(description);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalDescription('');
  };

  const handleEditClick = (product) => {
    const productData = { ...product };
    delete productData.id;

    setNewProductData(productData);
    setEditingProductId(product.id);
    setCurrentStep('form');
  };

  const handleDeleteClick = (productId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this product?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`${process.env.REACT_APP_API_URL}/products/${productId}`)
          .then(() => {
            Swal.fire('Deleted!', 'Product has been deleted.', 'success');
            axios.get(`${process.env.REACT_APP_API_URL}/products?subcategoryId=${selectedSubcategoryId}`)
              .then(res => setProducts(res.data));
          })
          .catch(() => {
            Swal.fire('Error', 'Failed to delete product.', 'error');
          });
      }
    });
  };

  return (
    <div className="product-management-container">
      {currentStep === 'list' && (
        <>
          <h2>Product Management</h2>

          <div className="filters-row">
            <label className="filter-label">
              Category:
              <select value={selectedCategoryId} onChange={e => setSelectedCategoryId(e.target.value)} className="filter-select">
                <option value="">-- Select Category --</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </label>

            <label className="filter-label">
              Subcategory:
              <select value={selectedSubcategoryId} onChange={e => setSelectedSubcategoryId(e.target.value)} className="filter-select" disabled={!selectedCategoryId}>
                <option value="">-- Select Subcategory --</option>
                {subcategories.map(sub => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </select>
            </label>
          </div>

          {!selectedSubcategoryId && <p className="placeholder-text">Please select a category and subcategory to view products.</p>}

          {selectedSubcategoryId && (
            <>
              <div className="table-header-row" style={{ display: 'flex', alignItems: 'center' }}>
                <h3 style={{ paddingRight: '80px' }}>Products</h3>
                <button className="add-product-btn" style={{ marginLeft: 'auto' }} onClick={handleAddProductClick}>+ Add New Product</button>
              </div>

              <div className="table-wrapper">
                {products.length === 0 ? (
                  <p>No products found for selected subcategory.</p>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        {Object.keys(products[0]).filter(col => col !== 'id' && col !== 'created_at').map(col => (
                          <th key={col}>{col.charAt(0).toUpperCase() + col.slice(1)}</th>
                        ))}
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(prod => (
                        <tr key={prod.id}>
                          {Object.keys(prod).filter(col => col !== 'id' && col !== 'created_at').map(col => (
                            col === 'description' ? (
                              <td
                                key={col}
                                onClick={() => handleDescriptionClick(prod[col])}
                                style={{ cursor: 'pointer', color: '#007bff', textDecoration: 'underline' }}
                                title="Click to view full description"
                              >
                                {prod[col]?.length > 30 ? prod[col].substring(0, 30) + '...' : prod[col]}
                              </td>
                            ) : (
                              <td key={col}>{prod[col]}</td>
                            )
                          ))}
                          <td>
                            <button className="btn-edit" onClick={() => handleEditClick(prod)} title="Edit">
  <FiEdit size={18} />
</button>
<button className="btn-delete" onClick={() => handleDeleteClick(prod.id)} title="Delete">
  <FiTrash size={18} />
</button>

                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}
        </>
      )}

      {currentStep === 'form' && Object.keys(newProductData).length > 0 && (
        <form onSubmit={handleSubmit} className="add-product-form">
          <h3>{editingProductId ? 'Edit Product' : 'Add New Product'}</h3>

         {Object.keys(newProductData).map(field => {

  return (
    <div className="form-field" key={field}>
      <label>
        {field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
        {field === 'description' ? (
          <textarea
            value={newProductData[field]}
            onChange={e => handleInputChange(field, e.target.value)}
            className="form-input"
          />
        ) : (
          <input
            type={field.includes('price') || field.includes('quantity') ? 'number' : 'text'}
            step={field.includes('price') ? '0.01' : undefined}
            value={newProductData[field]}
            onChange={e => handleInputChange(field, e.target.value)}
            className="form-input"
          />
        )}
      </label>
    </div>
  );
})}


          <div className="form-buttons">
            <button type="submit" className="btn-submit">{editingProductId ? 'Update' : 'Add'} Product</button>
            <button type="button" onClick={() => setCurrentStep('list')} className="btn-cancel">Back to Products</button>
          </div>
        </form>
      )}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <p>{modalDescription}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductSection;
