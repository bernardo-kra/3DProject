import React from 'react'
import './styled.css'

const Button = ({ text, icon, onClick, className }) => {
  return (
    <button className={`custom-button ${className}`} onClick={onClick}>
      {icon && <span className="button-icon">{icon}</span>}
      <span className="button-text">{text}</span>
    </button>
  );
};

export default Button;
