import { useEffect, useState } from 'react';

export const useIsMobile = (maxWidth: number = 768): boolean => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < maxWidth);
    };

    // Set the initial value
    handleResize();

    window.addEventListener('resize', handleResize);

    // Cleanup the event listener
    return () => window.removeEventListener('resize', handleResize);
  }, [maxWidth]);

  return isMobile;
};
