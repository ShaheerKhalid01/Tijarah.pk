'use client';

import { useEffect, useState } from 'react';

export default function TestAuth() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    // Test if we can access this page directly
    setMessage('If you can see this, middleware might not be working properly');
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Test Auth Page</h1>
      <p>This page should be protected by middleware.</p>
      <p>{message}</p>
      <p>Current URL: {typeof window !== 'undefined' ? window.location.href : 'Server-side'}</p>
    </div>
  );
}
