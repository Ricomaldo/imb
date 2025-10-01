// src/hooks/useDeviceDetect.js

import { useState, useEffect } from 'react';

/**
 * Hook de détection de device mobile
 * @returns {Object} { isMobile: boolean }
 */
export const useDeviceDetect = () => {
  const [isMobile, setIsMobile] = useState(
    window.innerWidth < 768
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { isMobile };
};

export default useDeviceDetect;
