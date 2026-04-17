import { useState, useEffect } from 'react';

export function useColorExtractor(imageUrl: string | undefined) {
  const [colors, setColors] = useState<{ primary: string; secondary: string }>({
    primary: '#f8fafc',
    secondary: '#f1f5f9',
  });

  useEffect(() => {
    if (!imageUrl) return;

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageUrl;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let r = 0, g = 0, b = 0;
        const count = imageData.length / 4;

        // Sample every 10th pixel for performance
        const step = 40; 
        let sampledCount = 0;

        for (let i = 0; i < imageData.length; i += step) {
          r += imageData[i];
          g += imageData[i + 1];
          b += imageData[i + 2];
          sampledCount++;
        }

        r = Math.floor(r / sampledCount);
        g = Math.floor(g / sampledCount);
        b = Math.floor(b / sampledCount);

        // Lighten the color for background (Light Mode)
        const factor = 0.6; 
        const rL = Math.floor(r + (255 - r) * factor);
        const gL = Math.floor(g + (255 - g) * factor);
        const bL = Math.floor(b + (255 - b) * factor);
        
        const primary = `rgb(${rL}, ${gL}, ${bL})`;
        const secondary = `rgb(${Math.max(0, rL - 30)}, ${Math.max(0, gL - 30)}, ${Math.max(0, bL - 30)})`;

        setColors({ primary, secondary });
      } catch (e) {
        console.error('Error extracting color', e);
      }
    };
  }, [imageUrl]);

  return colors;
}
