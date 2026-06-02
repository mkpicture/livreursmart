import React, { useState, useEffect } from 'react';

export default function PaymentModal({ isOpen, clientName, onClose, onConfirm }) {
  const [selectedMethod, setSelectedMethod] = useState(null);

  // Reset selected method on open/close
  useEffect(() => {
    if (isOpen) {
      setSelectedMethod(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
          </svg>
        </div>
        <h3>Paiement de la Livraison</h3>
        <p>Sélectionnez qui encaisse le montant de la <strong>livraison</strong> pour le client <span className="modal-highlight">{clientName}</span> :</p>
        
        <div className="modal-options">
          <button 
            type="button" 
            className={`modal-opt-btn ${selectedMethod === 'izoua' ? 'selected' : ''}`}
            onClick={() => setSelectedMethod('izoua')}
          >
            <span className="opt-title">Chez Izoua</span>
            <span className="opt-desc">Montant reversé au restaurant</span>
          </button>
          <button 
            type="button" 
            className={`modal-opt-btn ${selectedMethod === 'moi' ? 'selected' : ''}`}
            onClick={() => setSelectedMethod('moi')}
          >
            <span className="opt-title">Chez Moi</span>
            <span className="opt-desc">Gardé dans ma caisse</span>
          </button>
        </div>
        
        <div className="modal-actions">
          <button type="button" className="btn-cancel" onClick={onClose}>Annuler</button>
          <button 
            type="button" 
            className="btn-confirm" 
            disabled={!selectedMethod}
            onClick={() => onConfirm(selectedMethod)}
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}
