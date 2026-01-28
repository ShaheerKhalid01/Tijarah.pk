'use client';

import { useState, useEffect } from 'react';

export default function TestAuthPage() {
  const [testResults, setTestResults] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const runTests = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Test database connection
        const dbTest = await fetch('/api/auth/test-db').then(res => res.json());
        
        // Test session
        const sessionTest = await fetch('/api/auth/test-session', {
          credentials: 'include',
          cache: 'no-store'
        }).then(res => res.json());
        
        setTestResults({
          dbTest,
          sessionTest,
          timestamp: new Date().toISOString()
        });
        
      } catch (err) {
        console.error('Test error:', err);
        setError(err.message || 'An error occurred while running tests');
      } finally {
        setIsLoading(false);
      }
    };
    
    runTests();
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Authentication Test</h1>
      
      {isLoading ? (
        <div className="p-4 bg-blue-50 text-blue-700 rounded">
          Running tests...
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-700 rounded mb-6">
          <h2 className="font-bold">Error</h2>
          <pre className="whitespace-pre-wrap mt-2">{error}</pre>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-4 bg-white shadow rounded">
            <h2 className="font-bold mb-2">Database Test</h2>
            <pre className="text-sm bg-gray-50 p-3 rounded overflow-auto">
              {JSON.stringify(testResults.dbTest, null, 2)}
            </pre>
          </div>
          
          <div className="p-4 bg-white shadow rounded">
            <h2 className="font-bold mb-2">Session Test</h2>
            <pre className="text-sm bg-gray-50 p-3 rounded overflow-auto">
              {JSON.stringify(testResults.sessionTest, null, 2)}
            </pre>
          </div>
          
          <div className="text-sm text-gray-500">
            Last updated: {new Date(testResults.timestamp).toLocaleString()}
          </div>
        </div>
      )}
      
      <div className="mt-8 p-4 bg-yellow-50 text-yellow-700 rounded">
        <h2 className="font-bold mb-2">Next Steps:</h2>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Check the database test results above</li>
          <li>Verify the session test shows your expected user</li>
          <li>Check browser cookies for session tokens</li>
          <li>Try logging in again after reviewing the test results</li>
        </ol>
      </div>
    </div>
  );
}
