'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DebugPage() {
  const { data: session, status } = useSession();
  const [apiData, setApiData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function checkSession() {
      if (status === 'authenticated') {
        setLoading(true);
        try {
          const response = await fetch('/api/debug/session');
          const data = await response.json();
          setApiData(data);
        } catch (error) {
          setApiData({ error: 'Failed to fetch session data' });
        } finally {
          setLoading(false);
        }
      }
    }
    checkSession();
  }, [status]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            🔍 Session Debug Information
          </h1>

          {/* Session Status */}
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Session Status
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Status: <span className="font-mono font-bold">{status}</span>
            </p>
          </div>

          {/* Client Session Data */}
          {session && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Client Session Data
              </h2>
              <pre className="text-sm text-gray-700 dark:text-gray-300 overflow-x-auto bg-white dark:bg-gray-900 p-4 rounded">
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>
          )}

          {/* API Session Data */}
          {loading && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300">Loading API data...</p>
            </div>
          )}

          {apiData && (
            <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Server Session Data
              </h2>
              <pre className="text-sm text-gray-700 dark:text-gray-300 overflow-x-auto bg-white dark:bg-gray-900 p-4 rounded">
                {JSON.stringify(apiData, null, 2)}
              </pre>

              {/* Analysis */}
              {apiData.success && (
                <div className="mt-4 p-3 bg-white dark:bg-gray-900 rounded">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Analysis:</h3>
                  <ul className="space-y-1 text-sm">
                    <li className="text-gray-700 dark:text-gray-300">
                      ✓ User Email: <span className="font-mono">{apiData.user?.email}</span>
                    </li>
                    <li className="text-gray-700 dark:text-gray-300">
                      ✓ Tenant ID: <span className="font-mono">{apiData.user?.tenantId}</span>
                    </li>
                    <li className={apiData.customerExists ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                      {apiData.customerExists ? '✓' : '✗'} Customer Exists: {apiData.customerExists ? 'Yes' : 'No'}
                    </li>
                    {apiData.customerDetails && (
                      <li className="text-gray-700 dark:text-gray-300">
                        ✓ Customer Active: {apiData.customerDetails.isActive ? 'Yes' : 'No'}
                      </li>
                    )}
                  </ul>

                  {!apiData.customerExists && (
                    <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                      <p className="text-red-800 dark:text-red-200 font-semibold mb-2">⚠️ Issue Found!</p>
                      <p className="text-red-700 dark:text-red-300 text-sm">
                        Your session has a tenant ID that doesn't exist in the database.
                      </p>
                      <p className="text-red-700 dark:text-red-300 text-sm mt-2">
                        <strong>Solution:</strong> Log out and log back in with: demo@example.com / demo1234
                      </p>
                    </div>
                  )}

                  {apiData.customerExists && (
                    <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                      <p className="text-green-800 dark:text-green-200 font-semibold">✅ Session is valid!</p>
                      <p className="text-green-700 dark:text-green-300 text-sm">
                        You should be able to create legal entities and trial balances.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Instructions
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Check if "Customer Exists" is "Yes"</li>
              <li>If "No", log out and log back in with demo credentials</li>
              <li>Demo credentials: <span className="font-mono">demo@example.com</span> / <span className="font-mono">demo1234</span></li>
              <li>After logging in, return to this page to verify</li>
            </ol>
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-4">
            <Link
              href="/"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Go Home
            </Link>
            <Link
              href="/legal-entities"
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Legal Entities
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

