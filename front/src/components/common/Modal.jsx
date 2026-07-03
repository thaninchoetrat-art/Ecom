import React from 'react';
export default function Modal({children, onClose}){
  return (
    <div className="modal">
      <div className="modal-content">{children}</div>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
