import { useState } from 'react';

interface DebugPanelProps {
  data: any;
  title?: string;
}

export function DebugPanel({ data, title = 'Debug Info' }: DebugPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="mb-6 space-y-2 border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-2 text-left text-sm font-medium bg-gray-100 hover:bg-gray-200 flex items-center justify-between"
      >
        <span>{title}</span>
        <span className="text-gray-500">
          {isExpanded ? '▼' : '▶'}
        </span>
      </button>
      {isExpanded && (
        <pre className="text-xs p-4 bg-gray-50 overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}
