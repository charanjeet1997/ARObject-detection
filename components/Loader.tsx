
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-30">
        <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
