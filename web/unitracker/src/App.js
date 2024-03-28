import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

axios.interceptors.request.use(request => {
  return request;
});

axios.interceptors.response.use(response => {
  return response;
}, error => {
  return Promise.reject(error);
});

function App() {
  const [protocol, setProtocol] = useState('https');
  const [ipAddress, setIpAddress] = useState('localhost');
  const [port, setPort] = useState('6176');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [ids, setIds] = useState('');
  const [days, setDays] = useState('');
  const [responseData, setResponseData] = useState('');

  const sendData = () => {
    const formattedIds = ids.split(',').map(id => id.trim());
    const payload = {
      ids: formattedIds,
      days: parseInt(days, 10),
    };

    // Build the headers
    const headers = {
      'Accept': '*/*',
      'Content-Type': 'application/json; charset=utf-8',
    };

    // Delete auth from headers if fields are empty
    if (username && password) {
      headers['Authorization'] = `Basic ${btoa(username + ':' + password)}`;
    } else {
      delete headers.Authorization;
    }

    // Request to endpoint
    axios.post(`${protocol}://${ipAddress}:${port}/`, payload, {
      headers: headers,
    })
    .then(response => {
      setResponseData(JSON.stringify(response.data, null, 2)); // Set response data
      alert('Data fetched successfully!');
    })
    .catch(error => {
      if (error.response) {
        setResponseData(JSON.stringify(error.response.data, null, 2)); // Set response error data
        alert(`Failed to fetch data: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        setResponseData('No response from the server. Ensure the server is reachable and the URL is correct.'); // Set no response message
        alert('Failed to fetch data: No response from the server. Ensure the server is reachable and the URL is correct.');
      } else {
        setResponseData(error.message); // Set error message
        alert('Failed to fetch data: ' + error.message);
      }
    });
  };

  return (
    <div className="App">
      <h2>UniTracker</h2>
      <select value={protocol} onChange={(e) => setProtocol(e.target.value)}>
        <option value="http">HTTP</option>
        <option value="https">HTTPS</option>
      </select>
      <input type="text" placeholder="IP Address" value={ipAddress} onChange={(e) => setIpAddress(e.target.value)} />
      <input type="text" placeholder="Port" value={port} onChange={(e) => setPort(e.target.value)} />
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <input type="text" placeholder="IDs (comma-separated)" value={ids} onChange={(e) => setIds(e.target.value)} />
      <input type="number" placeholder="Days" value={days} onChange={(e) => setDays(e.target.value)} />
      <button onClick={sendData}>Send Data</button>
      <div className="response-box">
        <h3>Response</h3>
        <pre>{responseData}</pre>
      </div>
    </div>
  );
}

export default App;
