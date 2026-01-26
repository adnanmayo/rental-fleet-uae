'use client';

import { useState } from 'react';
import { siteConfig } from '@/lib/site-config';
import { generateAttributionBadge } from '@/lib/seo-utils';

export default function BacklinkBadge() {
  const [copied, setCopied] = useState(false);
  const badgeCode = generateAttributionBadge();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(badgeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-3">Link Back to Us</h3>
      <p className="text-sm text-gray-600 mb-4">
        Use our badge to link back and show your support for UAE rental businesses
      </p>

      {/* Preview */}
      <div className="mb-4 p-4 bg-white border border-gray-200 rounded-lg">
        <a
          href={siteConfig.url}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center px-3 py-2 bg-gray-100 rounded-md text-gray-800 hover:bg-gray-200 transition-colors text-sm"
        >
          <span className="mr-2">Powered by</span>
          <strong>{siteConfig.name}</strong>
        </a>
      </div>

      {/* Code Snippet */}
      <div className="relative">
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs overflow-x-auto">
          <code>{badgeCode}</code>
        </pre>
        <button
          onClick={copyToClipboard}
          className="absolute top-2 right-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
        >
          {copied ? 'Copied!' : 'Copy Code'}
        </button>
      </div>
    </div>
  );
}
