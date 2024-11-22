
import React, { useState } from 'react';

const APITest = () => {
  const [apiResponse, setApiResponse] = useState('');
  const url = localStorage.getItem('url');
  const testApi = async () => {
    try {
      const response = await fetch(`${url}/api/test/1/`);
      const data = await response.json();
      setApiResponse(data.message);
    } catch (error) {
      setApiResponse('API is not working!');
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>API Testing Page</h1>
      <button onClick={testApi}>Test API</button>
      {apiResponse && <p>Response: {apiResponse}</p>}
    </div>
  );
};

export default APITest;
