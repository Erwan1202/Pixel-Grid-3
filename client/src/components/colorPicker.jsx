import React from 'react';
import './ColorPicker.css';

const COLORS = [
  '#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082',
  '#8B00FF', '#FFFFFF', '#C0C0C0', '#808080', '#000000', '#800000',
];

const ColorPicker = ({ selectedColor, onColorChange }) => {
  return (
    <div className="color-picker-container">
      {COLORS.map((color) => (
        <div
          key={color}
          className={`color-swatch ${selectedColor === color ? 'selected' : ''}`}
          style={{ backgroundColor: color }}
          onClick={() => onColorChange(color)}
        />
      ))}
    </div>
  );
};

export default ColorPicker;