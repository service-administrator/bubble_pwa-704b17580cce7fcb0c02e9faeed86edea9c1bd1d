// Modal.js
import React, { useState, useEffect } from 'react';
import './style.css';

function Modal({ title, body, onClose, customFooter }) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
  };

  useEffect(() => {
    if (isClosing) {
      const timer = setTimeout(() => {
        onClose();
      }, 300); // 애니메이션 지속 시간과 일치시킵니다.
      return () => clearTimeout(timer);
    }
  }, [isClosing, onClose]);

  return (
    <div className={`modal-overlay ${isClosing ? 'closing' : ''}`}>
      <div className={`modal ${isClosing ? 'closing' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
        </div>
        <div className="modal-body">
          <p>{body}</p>
        </div>
        <div className="modal-footer">
          {customFooter ? customFooter(handleClose) : <button className="close-button" onClick={handleClose}>Close</button>}
        </div>
      </div>
    </div>
  );
}

export default Modal;
