"use client";

import React from 'react';
import { PixelState } from '../types';
import { generatePixelString, generateFileName } from '../utils';

interface DownloadButtonProps {
  pixelState: PixelState;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ pixelState }) => {
  const handleDownload = () => {
    try {
      const textContent = generatePixelString(pixelState);
      const fileName = generateFileName(pixelState);

      const blob = new Blob([textContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to generate download:", error);
      alert("An error occurred while generating the file. Please copy the URL manually.");
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="inline-flex w-full items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-white bg-emerald-600 text-white hover:bg-emerald-700 h-11 px-8 shadow-sm"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="18" 
        height="18" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="mr-2"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      Download .txt File
    </button>
  );
};

export default DownloadButton;