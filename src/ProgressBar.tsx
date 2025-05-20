'use client';
import React from 'react';

interface DefaultBarProps {
  progress: number;
  color?: string;
  height?: string;
}

const DefaultBar: React.FC<DefaultBarProps> = ({
  progress,
  color = '#2299DD',    // default color (sky blue)
  height = '3px'        // default height (3px)
}) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: progress + '%',
        height: height,
        backgroundColor: color,
        transition: 'width 0.2s ease, opacity 0.3s ease',
        opacity: progress < 100 ? 1 : 0,
        zIndex: 9999
      }}
    />
  );
};

export default DefaultBar;
