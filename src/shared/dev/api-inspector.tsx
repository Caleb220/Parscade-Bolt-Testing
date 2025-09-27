/**
 * API Inspector Development Tool
 * Provides runtime debugging and monitoring of API calls
 * Only active in development mode
 */

import React, { useState, useEffect } from 'react';

import { getValidationSummary } from '@/lib/api/setup';
import { apiValidator } from '@/lib/api/validation';

interface ApiCall {
  id: string;
  timestamp: string;
  method: string;
  endpoint: string;
  status: 'pending' | 'success' | 'error';
  duration?: number;
  requestData?: any;
  responseData?: any;
  error?: string;
}

interface ApiInspectorProps {
  isOpen: boolean;
  onToggle: () => void;
}

const ApiInspector: React.FC<ApiInspectorProps> = ({ isOpen, onToggle }) => {
  const [apiCalls, setApiCalls] = useState<ApiCall[]>([]);
  const [selectedCall, setSelectedCall] = useState<ApiCall | null>(null);
  const [filter, setFilter] = useState<'all' | 'success' | 'error'>('all');

  // Intercept fetch calls in development
  useEffect(() => {
    if (import.meta.env.NODE_ENV !== 'development') return;

    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      const [url, options] = args;
      const callId = `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const startTime = Date.now();

      const newCall: ApiCall = {
        id: callId,
        timestamp: new Date().toISOString(),
        method: options?.method || 'GET',
        endpoint: url.toString(),
        status: 'pending',
        requestData: options?.body ? JSON.parse(options.body as string) : null,
      };

      setApiCalls(prev => [newCall, ...prev.slice(0, 99)]); // Keep last 100 calls

      try {
        const response = await originalFetch(...args);
        const duration = Date.now() - startTime;
        const responseData = response.headers.get('content-type')?.includes('application/json')
          ? await response.clone().json()
          : null;

        setApiCalls(prev =>
          prev.map(call =>
            call.id === callId
              ? {
                  ...call,
                  status: response.ok ? 'success' : 'error',
                  duration,
                  responseData,
                  error: response.ok ? undefined : `${response.status} ${response.statusText}`,
                }
              : call
          )
        );

        return response;
      } catch (error) {
        const duration = Date.now() - startTime;

        setApiCalls(prev =>
          prev.map(call =>
            call.id === callId
              ? {
                  ...call,
                  status: 'error',
                  duration,
                  error: error instanceof Error ? error.message : 'Unknown error',
                }
              : call
          )
        );

        throw error;
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  const filteredCalls = apiCalls.filter(call => {
    if (filter === 'all') return true;
    return call.status === filter;
  });

  const validationSummary = getValidationSummary();

  if (import.meta.env.NODE_ENV !== 'development') {
    return null;
  }

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 z-50"
        title="Open API Inspector"
      >
        🔍
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex">
      <div className="bg-white w-full max-w-6xl mx-4 my-4 rounded-lg shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">API Inspector</h2>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded text-sm ${
                  filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100'
                }`}
              >
                All ({apiCalls.length})
              </button>
              <button
                onClick={() => setFilter('success')}
                className={`px-3 py-1 rounded text-sm ${
                  filter === 'success' ? 'bg-green-600 text-white' : 'bg-gray-100'
                }`}
              >
                Success ({apiCalls.filter(c => c.status === 'success').length})
              </button>
              <button
                onClick={() => setFilter('error')}
                className={`px-3 py-1 rounded text-sm ${
                  filter === 'error' ? 'bg-red-600 text-white' : 'bg-gray-100'
                }`}
              >
                Errors ({apiCalls.filter(c => c.status === 'error').length})
              </button>
            </div>
            <button
              onClick={() => setApiCalls([])}
              className="px-3 py-1 bg-gray-100 rounded text-sm hover:bg-gray-200"
            >
              Clear
            </button>
            <button
              onClick={onToggle}
              className="px-3 py-1 bg-gray-100 rounded text-sm hover:bg-gray-200"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* API Calls List */}
          <div className="w-1/2 border-r flex flex-col">
            <div className="p-3 bg-gray-50 border-b">
              <h3 className="font-medium">API Calls</h3>
            </div>
            <div className="flex-1 overflow-auto">
              {filteredCalls.map(call => (
                <div
                  key={call.id}
                  onClick={() => setSelectedCall(call)}
                  className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                    selectedCall?.id === call.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block w-2 h-2 rounded-full ${
                          call.status === 'success'
                            ? 'bg-green-500'
                            : call.status === 'error'
                              ? 'bg-red-500'
                              : 'bg-yellow-500'
                        }`}
                      />
                      <span className="font-mono text-sm font-medium">{call.method}</span>
                    </div>
                    <span className="text-xs text-gray-500">{call.duration}ms</span>
                  </div>
                  <div className="text-sm text-gray-700 truncate mt-1">{call.endpoint}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(call.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Details Panel */}
          <div className="w-1/2 flex flex-col">
            {selectedCall ? (
              <>
                <div className="p-3 bg-gray-50 border-b">
                  <h3 className="font-medium">Call Details</h3>
                </div>
                <div className="flex-1 overflow-auto p-4 space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Request</h4>
                    <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                      <div>
                        {selectedCall.method} {selectedCall.endpoint}
                      </div>
                      {selectedCall.requestData && (
                        <pre className="mt-2 text-xs overflow-auto">
                          {JSON.stringify(selectedCall.requestData, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Response</h4>
                    <div className="bg-gray-100 p-3 rounded text-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`inline-block w-2 h-2 rounded-full ${
                            selectedCall.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                          }`}
                        />
                        <span className="font-medium">
                          {selectedCall.status === 'success' ? 'Success' : 'Error'}
                        </span>
                        <span className="text-gray-500">{selectedCall.duration}ms</span>
                      </div>

                      {selectedCall.error && (
                        <div className="text-red-600 mb-2">Error: {selectedCall.error}</div>
                      )}

                      {selectedCall.responseData && (
                        <pre className="text-xs overflow-auto font-mono">
                          {JSON.stringify(selectedCall.responseData, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Validation</h4>
                    <div className="bg-gray-100 p-3 rounded text-sm">
                      {Object.entries(validationSummary).find(([endpoint]) =>
                        selectedCall.endpoint.includes(endpoint.replace(':id', ''))
                      ) ? (
                        <div className="text-green-600">✅ Validation schemas registered</div>
                      ) : (
                        <div className="text-yellow-600">⚠️ No validation schemas found</div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Select an API call to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiInspector;
