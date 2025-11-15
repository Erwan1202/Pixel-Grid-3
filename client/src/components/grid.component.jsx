import React, { useState, useEffect, useRef, useCallback } from 'react';
import apiClient from '../services/api.js';
import socket from '../services/socket.services.js';
import './grid.css';

const GRID_SIZE = 100;

const PixelGrid = ({ selectedColor }) => {
  const [pixels, setPixels] = useState(new Map());
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const [nowTime, setNowTime] = useState(Date.now());
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

  const handleGridClick = useCallback(async (event) => {
    const now = Date.now();
    if (now < cooldownUntil) {
      const remaining = Math.ceil((cooldownUntil - now) / 1000);
      alert(`Veuillez patienter ${remaining} seconde(s) avant de placer un autre pixel.`);
      return;
    }

    console.log('CLICK EVENT CAPTURED:', event.target);

    if (!event.target.classList.contains('pixel')) {
      console.log('CLICK IGNORED: Target is not a pixel.');
      return;
    }

    const id = event.target.id;
    const [, x, y] = id.split('-').map(Number);

    console.log(`ATTEMPTING POST: x=${x}, y=${y}, color=${selectedColor}`);

    try {
      await apiClient.post('/api/grid/pixel', {
        x: x,
        y: y,
        color: selectedColor,
      });
      console.log('POST SUCCESS');

    } catch (error) {
      console.error('Erreur lors du placement du pixel:', error);
      if (error.response?.status === 429) {
        const retryHeader = error.response.headers?.['retry-after'];
        const retrySeconds = retryHeader ? parseInt(retryHeader, 10) : 5;
        const until = Date.now() + (isNaN(retrySeconds) ? 5000 : retrySeconds * 1000);
        setCooldownUntil(until);
        alert('Vous placez des pixels trop rapidement ! Réessayez dans ' + (Math.ceil((until - Date.now()) / 1000)) + 's.');
      } else if (error.response?.status === 401) {
        alert('Veuillez vous reconnecter pour placer un pixel.');
      }
    }
  }, [selectedColor, cooldownUntil]); 

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

    return () => {
    };
  }, []); 

  useEffect(() => {
    if (!gridRef.current) return; 

    const gridContainer = gridRef.current;

    gridContainer.addEventListener('click', handleGridClick);

    return () => {
      gridContainer.removeEventListener('click', handleGridClick);
      console.log('EVENT LISTENER DETACHED'); 
    };

  }, [handleGridClick]); 

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

  useEffect(() => {
    if (!cooldownUntil || cooldownUntil <= Date.now()) return;
    const interval = setInterval(() => setNowTime(Date.now()), 500);
    return () => clearInterval(interval);
  }, [cooldownUntil]);


  const remainingSeconds = cooldownUntil > Date.now() ? Math.max(0, Math.ceil((cooldownUntil - nowTime) / 1000)) : 0;

  return (
    <>
      {cooldownUntil > Date.now() && (
        <div className="cooldown-banner">
          Veuillez patienter {remainingSeconds} seconde(s) avant de placer un pixel.
        </div>
      )}
      <div id="grid-container" className={`pixel-grid ${cooldownUntil > Date.now() ? 'cooldown-active' : ''}`}>
      </div>
    </>
  );
};

export default PixelGrid;