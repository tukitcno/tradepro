import React from 'react';

const Debug = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  
  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-2 rounded text-xs">
      <div>API URL: {apiUrl || 'Not set'}</div>
      <div>Mode: {process.env.NODE_ENV}</div>
    </div>
  );
};

export default Debug;