
import React, { useEffect, useState } from 'react';
import type { DetectedObject } from '../types';
import { TagIcon, InformationCircleIcon } from './Icons';

interface InfoOverlayProps {
  object: DetectedObject;
}

const InfoOverlay: React.FC<InfoOverlayProps> = ({ object }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation on mount or when object changes
    setIsVisible(true);
    // Set a timeout to fade out, making it a notification-like appearance
    const timer = setTimeout(() => setIsVisible(false), 2800);
    return () => clearTimeout(timer);
  }, [object]);

  if (!object) return null;

  return (
    <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md p-4 bg-black/70 backdrop-blur-md rounded-xl border border-cyan-400/30 shadow-2xl shadow-cyan-500/20 z-20 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 bg-cyan-500/20 p-2 rounded-full">
            <TagIcon className="w-6 h-6 text-cyan-400" />
        </div>
        <div>
            <h3 className="text-xl font-bold text-white tracking-wide">{object.objectName}</h3>
            <p className="text-gray-300 mt-1">{object.description}</p>
        </div>
      </div>
    </div>
  );
};

export default InfoOverlay;
