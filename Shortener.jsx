import React, { useState } from 'react';
import axios from '../services/api';

function Shortener() {
  const [urls, setUrls] = useState(['']);
  const [results, setResults] = useState([]);

  const handleChange = (i, field, value) => {
    const newUrls = [...urls];
    newUrls[i] = { ...newUrls[i], [field]: value };
    setUrls(newUrls);
  };

  const addRow = () => {
    if (urls.length < 5) setUrls([...urls, {}]);
  };

  const handleSubmit = async () => {
    const { data } = await axios.post('/url/shorten', { urls });
    setResults(data);
  };

  return (
    <div>
      <h2>Shorten URLs</h2>
      {urls.map((url, i) => (
        <div key={i}>
          <input placeholder="Original URL" onChange={e => handleChange(i, 'originalUrl', e.target.value)} />
          <input placeholder="Custom shortcode (optional)" onChange={e => handleChange(i, 'preferredCode', e.target.value)} />
          <input placeholder="Validity (s)" type="number" onChange={e => handleChange(i, 'expiresIn', e.target.value)} />
        </div>
      ))}
      <button onClick={addRow}>Add More</button>
      <button onClick={handleSubmit}>Shorten</button>
      <ul>
        {results.map(r => (
          <li key={r._id}>{window.location.origin}/{r.shortCode}</li>
        ))}
      </ul>
    </div>
  );
}

export default Shortener;