import React, { useState, useEffect } from 'react';
import { bannersAPI } from '../services/api';

export default function Banners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(null);
  
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await bannersAPI.getAll();
      const bannersData = Array.isArray(response.data) ? response.data : (response.data.data || response.data.banners || []);
      setBanners(bannersData);
    } catch (err) {
      console.error('Banners fetch error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load banners. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !image) {
      alert('Please provide both title and image');
      return;
    }

    setSubmitting(true);
    try {
      const imageData = await convertToBase64(image);
      await bannersAPI.create(title, imageData);
      setTitle('');
      setImage(null);
      setImagePreview(null);
      setShowForm(false);
      fetchBanners();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create banner');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this banner?')) return;
    setBusy(id);
    try {
      await bannersAPI.delete(id);
      setBanners(prev => prev.filter(b => b.bannerId !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete banner');
    } finally {
      setBusy(null);
    }
  };

  const cancelForm = () => {
    setTitle('');
    setImage(null);
    setImagePreview(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="page banners-page">
        <h1>Manage Banners</h1>
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page banners-page">
        <h1>Manage Banners</h1>
        <div className="error" style={{ padding: '20px', background: '#fee', borderRadius: '8px' }}>
          <strong>Error:</strong> {error}
          <br /><br />
          <small>Make sure the backend server is running at http://localhost:8080</small>
        </div>
      </div>
    );
  }

  return (
    <div className="page banners-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Manage Banners</h1>
        {!showForm && (
          <button className="btn" onClick={() => setShowForm(true)}>
            Add Banner
          </button>
        )}
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '20px', padding: '20px' }}>
          <h3>Add New Banner</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter banner title"
                required
                style={{ width: '100%', padding: '8px', fontSize: '14px' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
                style={{ width: '100%', padding: '8px', fontSize: '14px' }}
              />
              {imagePreview && (
                <div style={{ marginTop: '10px' }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ maxWidth: '200px', maxHeight: '100px', borderRadius: '4px' }}
                  />
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create Banner'}
              </button>
              <button type="button" className="btn btn-danger" onClick={cancelForm} disabled={submitting}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {banners.map(b => (
              <tr key={b.bannerId}>
                <td>
                  <img
                    src={b.imageData ? `data:image/jpeg;base64,${b.imageData}` : 'https://via.placeholder.com/800x200?text=No+Image'}
                    alt={b.title}
                    className="thumb"
                    style={{ maxWidth: '150px', maxHeight: '80px', objectFit: 'cover' }}
                  />
                </td>
                <td>{b.title}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(b.bannerId)}
                    disabled={busy === b.bannerId}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {banners.length === 0 && (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            No banners found
          </div>
        )}
      </div>
    </div>
  );
}