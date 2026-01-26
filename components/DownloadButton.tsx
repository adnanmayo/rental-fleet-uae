'use client';

interface DownloadButtonProps {
  title: string;
  file: string;
  description?: string;
  className?: string;
}

export default function DownloadButton({ title, file, description, className = '' }: DownloadButtonProps) {
  return (
    <a
      href={`/downloads/${file}`}
      download
      className={`inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg group ${className}`}
    >
      <svg
        className="w-5 h-5 mr-2 group-hover:animate-bounce"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <div className="text-left">
        <div className="text-sm font-semibold">{title}</div>
        {description && <div className="text-xs opacity-90">{description}</div>}
      </div>
    </a>
  );
}
