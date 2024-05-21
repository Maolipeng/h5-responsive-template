// useSupportsWebP.ts
import { useEffect, useState } from 'react';

const useSupportsWebP = (): boolean => {
  const [isWebPSupported, setIsWebPSupported] = useState<boolean>(false);

  useEffect(() => {
    const checkWebPSupport = (): void => {
      const webPImage = new Image();

      webPImage.onload = () => {
        setIsWebPSupported(true);
      };

      webPImage.onerror = () => {
        setIsWebPSupported(false);
      };

      webPImage.src =
        'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
    };

    checkWebPSupport();
  }, []);

  return isWebPSupported;
};

export default useSupportsWebP;
