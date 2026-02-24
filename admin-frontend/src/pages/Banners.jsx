import React, { useState } from 'react';

export default function Banners({ banners, toggleBanner, deleteBanner }) {
  const [busy, setBusy] = useState(null);

  const handleToggle = async (id) => {
    setBusy(id);
    try {
      await toggleBanner(id);
    } finally {
      setBusy(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this banner?')) return;
    setBusy(id);
    try {
      await deleteBanner(id);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="page banners-page">
      <h1>Manage Banners</h1>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Preview</th>
              <th>Image URL</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {banners.map(b => (
              <tr key={b.id}>
                <td><img src={b.imageUrl} alt="banner" className="thumb" /></td>
                <td className="mono">{b.imageUrl}</td>
                <td>{b.active ? 'Enabled' : 'Disabled'}</td>
                <td>
                  <button className="btn" onClick={() => handleToggle(b.id)} disabled={busy===b.id}>{b.active ? 'Disable' : 'Enable'}</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(b.id)} disabled={busy===b.id}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
