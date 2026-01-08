// components/LoadingSpinner.tsx
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    // Fixed container with a slightly darker, but still blurred, transparent background.
    // Increased opacity for better visibility on busy backgrounds.
    <div 
      className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-[100]" 
      aria-live="polite"
      aria-label="Content is loading"
      role="status"
    >
      {/* The actual spinner element. 
        Uses a thicker border (border-8) for a bolder look.
        The border color is now controlled purely by Tailwind classes.
      */}
      <div 
        className="w-20 h-20 border-8 border-gray-200 border-t-8 border-t-emerald-600 rounded-full animate-spin shadow-2xl"
      />
    </div>
  );
};

export default LoadingSpinner;