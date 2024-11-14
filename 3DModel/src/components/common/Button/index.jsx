// Button.js
import React from 'react';
import './styled.css';

const Button = ({ text, icon, onClick, className, disabled }) => {
  return (
    <button
      className={`custom-button ${className} ${disabled ? 'disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="button-icon">{icon}</span>}
      <span className="button-text">{text}</span>
    </button>
  );
};

export default Button;
