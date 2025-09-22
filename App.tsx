
import React, { useState, useEffect } from 'react';
import CameraFeed from './components/CameraFeed';
import PermissionsGate from './components/PermissionsGate';
import { SparklesIcon, VideoCameraSlashIcon } from './components/Icons';

const App: React.FC = () => {
  const [isScanning, setIsScanning] = useState<boolean>(false);

  return (
    <main className="h-screen w-screen bg-gray-900 text-white flex flex-col items-center justify-center font-sans overflow-hidden">
      <div className="absolute top-5 left-5 z-20 flex items-center space-x-2 bg-black/50 backdrop-blur-sm p-2 rounded-lg">
        <SparklesIcon className="w-6 h-6 text-cyan-400" />
        <h1 className="text-xl font-bold tracking-wider">AR Object Lens</h1>
      </div>

      <PermissionsGate
        permission="camera"
        loadingContent={
          <div className="text-center">
            <p>Requesting camera permissions...</p>
          </div>
        }
        deniedContent={
          <div className="text-center p-8 bg-gray-800 rounded-lg shadow-lg">
            <VideoCameraSlashIcon className="w-16 h-16 mx-auto text-red-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Camera Access Denied</h2>
            <p className="text-gray-400">
              This application requires camera access to function.
              <br />
              Please enable it in your browser settings and refresh the page.
            </p>
          </div>
        }
      >
        <div className="relative w-full h-full">
          {isScanning ? (
            <CameraFeed />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-10">
              <div className="text-center p-8">
                <SparklesIcon className="w-24 h-24 mx-auto text-cyan-400 animate-pulse mb-6"/>
                <h2 className="text-4xl font-bold mb-4">Welcome to AR Object Lens</h2>
                <p className="text-gray-300 max-w-lg mx-auto mb-8">
                  Point your camera at any object to get real-time information. The app will continuously scan and identify objects without needing to press a button.
                </p>
                <button
                  onClick={() => setIsScanning(true)}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/30"
                >
                  Start Scanning
                </button>
              </div>
            </div>
          )}
        </div>
      </PermissionsGate>
    </main>
  );
};

export default App;
