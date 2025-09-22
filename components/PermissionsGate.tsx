
import React, { useState, useEffect } from 'react';

type PermissionName = 'camera';

interface PermissionsGateProps {
  permission: PermissionName;
  children: React.ReactNode;
  loadingContent: React.ReactNode;
  deniedContent: React.ReactNode;
}

const PermissionsGate: React.FC<PermissionsGateProps> = ({
  permission,
  children,
  loadingContent,
  deniedContent,
}) => {
  const [permissionState, setPermissionState] = useState<PermissionState>('prompt');

  useEffect(() => {
    async function checkPermission() {
      if (permission === 'camera') {
        try {
          const result = await navigator.permissions.query({ name: 'camera' as any });
          setPermissionState(result.state);
          result.onchange = () => setPermissionState(result.state);
        } catch (error) {
          // Fallback for browsers that don't support Permissions API well
          // We'll try to get user media and see what happens.
          try {
              const stream = await navigator.mediaDevices.getUserMedia({ video: true });
              // If we get here, permission was granted.
              setPermissionState('granted');
              // Stop the tracks immediately as we only needed to check permission.
              stream.getTracks().forEach(track => track.stop());
          } catch(err) {
              setPermissionState('denied');
          }
        }
      }
    }
    checkPermission();
  }, [permission]);

  if (permissionState === 'granted') {
    return <>{children}</>;
  }

  if (permissionState === 'denied') {
    return <>{deniedContent}</>;
  }

  return <>{loadingContent}</>;
};

export default PermissionsGate;
