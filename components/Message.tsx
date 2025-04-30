// components/Message.tsx
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface MessageProps {
  content: string;
  role: 'user' | 'assistant';
}

interface PropertyData {
  [key: string]: any;
}

const Message: React.FC<MessageProps> = ({ content, role }) => {
  const [processedContent, setProcessedContent] = useState(content);
  const [propertyData, setPropertyData] = useState<PropertyData[] | null>(null);

  useEffect(() => {
    if (role === 'assistant') {
      // Try to find JSON data in the message
      const jsonRegex = /```(?:json)?\s*(\[?\s*\{[\s\S]*?\}\s*\]?)```/g;
      const jsonMatch = jsonRegex.exec(content);

      if (jsonMatch && jsonMatch[1]) {
        try {
          // Parse the JSON data
          const parsedData = JSON.parse(jsonMatch[1]);

          // Store the parsed data
          setPropertyData(Array.isArray(parsedData) ? parsedData : [parsedData]);

          // Remove the JSON block from content for display
          const cleanedContent = content.replace(jsonMatch[0], '');
          setProcessedContent(cleanedContent);
        } catch (e) {
          console.error('Failed to parse property data:', e);
          setProcessedContent(content);
        }
      } else {
        setProcessedContent(content);
      }
    } else {
      setProcessedContent(content);
    }
  }, [content, role]);

  // Format a value based on its key name and value type
  const formatValue = (key: string, value: any): string => {
    if (value === null || value === undefined) return '-';

    if (typeof value === 'boolean') return value ? 'Yes' : 'No';

    if (typeof value === 'object') return JSON.stringify(value);

    // Format dates
    if ((key.includes('date') || key.includes('updated')) && typeof value === 'string') {
      try {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString();
        }
      } catch (e) { }
    }

    // Format area with units
    if ((key.includes('area') || key.includes('sqm')) && typeof value === 'number') {
      return `${value} sq.m`;
    }

    // Format prices/valuation
    if ((key.includes('valuation') || key.includes('value') || key.includes('price')) &&
      typeof value === 'number') {
      return `₹${value.toLocaleString('en-IN')}`;
    }

    return String(value);
  };

  // Format column header
  const formatHeader = (key: string): string => {
    return key
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
      .trim();
  };

  return (
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`px-4 py-3 rounded-lg ${role === 'user' ? 'max-w-[80%]' : 'max-w-[90%] md:max-w-[85%]'} ${role === 'user'
            ? 'bg-blue-600 text-white rounded-tr-none'
            : 'bg-gray-100 text-gray-800 rounded-tl-none'
          }`}
      >
        {role === 'assistant' ? (
          <div className="prose max-w-none dark:prose-invert">
            {/* Display regular markdown content */}
            <ReactMarkdown>{processedContent}</ReactMarkdown>

            {/* Display property data as table if available */}
            {propertyData && propertyData.length > 0 && (
              <div className="overflow-x-auto mt-4">
                <table className="min-w-full border-collapse table-auto">
                  <thead className="bg-gray-100">
                    <tr>
                      {Object.keys(propertyData[0]).map((key) => (
                        <th key={key} className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">
                          {formatHeader(key)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {propertyData.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        {Object.entries(item).map(([key, value]) => (
                          <td key={key} className="px-4 py-2 text-sm border-b border-gray-200 whitespace-nowrap">
                            {formatValue(key, value)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <p>{processedContent}</p>
        )}
      </div>
    </div>
  );
};

export default Message;