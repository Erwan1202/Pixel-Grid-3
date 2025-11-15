import React, { useState, useEffect, useRef } from 'react';
import apiClient from '../services/api';
import socket from '../services/socket.services';
import './grid.css'; 

const GRID_SIZE = 100; 

const PixelGrid = () => {
  const [pixels, setPixels] = useState(new Map());

  const gridRef = useRef(null);

  useEffect(() => {
    const fetchGrid = async () => {
      try {
        const response = await apiClient.get('/api/grid');
        const pixelsMap = new Map();
        response.data.forEach(pixel => {
          const key = `${pixel.x_coord}:${pixel.y_coord}`;
          pixelsMap.set(key, pixel.color);
        });
        setPixels(pixelsMap);
      } catch (error) {
        console.error('Erreur lors du chargement de la grille:', error);
      }
    };

    fetchGrid();

    socket.connect();


    socket.on('pixel_update', (updatedPixel) => {
      handlePixelUpdate(updatedPixel);
    });

    return () => {
      socket.off('pixel_update');
      socket.disconnect();
    };
  }, []);

  const handlePixelUpdate = (updatedPixel) => {
    const key = `${updatedPixel.x}:${updatedPixel.y}`;

    setPixels(prevPixels => new Map(prevPixels).set(key, updatedPixel.color));
  };

  useEffect(() => {
    if (gridRef.current) return; 

    const gridContainer = document.getElementById('grid-container');
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
      const x = i % GRID_SIZE;
      const y = Math.floor(i / GRID_SIZE);
      
      const pixelDiv = document.createElement('div');
      pixelDiv.className = 'pixel';
      pixelDiv.id = `pixel-${x}-${y}`;

      
      fragment.appendChild(pixelDiv);
    }
    gridContainer.appendChild(fragment);
    gridRef.current = gridContainer;

  }, []);

  useEffect(() => {
    if (!gridRef.current) return; 

    pixels.forEach((color, key) => {
      const [x, y] = key.split(':');
      const pixelDiv = document.getElementById(`pixel-${x}-${y}`);
      if (pixelDiv) {
        pixelDiv.style.backgroundColor = color;
      }
    });
  }, [pixels]);


  return (
    <div id="grid-container" className="pixel-grid">
      {/* Les pixels sont injectés ici par useEffect */}
    </div>
  );
};

export default PixelGrid;