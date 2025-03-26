// src/components/Modal.tsx
import React from 'react';

interface ModalProps {
  message: string;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ message, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{message}</h3>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
