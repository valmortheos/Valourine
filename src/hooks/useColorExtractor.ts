import { useState, useEffect } from 'react';

export function useColorExtractor(imageUrl: string | undefined) {
  const [colors, setColors] = useState<{ primary: string; secondary: string }>({
    primary: '#121212',
    secondary: '#1e1e1e',
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

        // Darken the color for background
        const factor = 0.4;
        const primary = `rgb(${Math.floor(r * factor)}, ${Math.floor(g * factor)}, ${Math.floor(b * factor)})`;
        const secondary = `rgb(${Math.floor(r * factor * 0.8)}, ${Math.floor(g * factor * 0.8)}, ${Math.floor(b * factor * 0.8)})`;

        setColors({ primary, secondary });
      } catch (e) {
        console.error('Error extracting color', e);
      }
    };
  }, [imageUrl]);

  return colors;
}
