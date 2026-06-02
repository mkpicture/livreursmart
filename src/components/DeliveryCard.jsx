import React, { useState, useEffect } from 'react';

export default function DeliveryCard({ delivery, onCompleteClick, alertThresholds }) {
  const [elapsedText, setElapsedText] = useState('0m 0s');
  const [timerAlertClass, setTimerAlertClass] = useState('');
  const [copyText, setCopyText] = useState('Copier');
  const isCompleted = delivery.endTime !== null;

  useEffect(() => {
    if (isCompleted) return;

    const updateTimer = () => {
      const start = new Date(delivery.startTime);
      const diffMs = new Date() - start;
      const diffMin = Math.floor(diffMs / 1000 / 60);
      const diffSec = Math.floor((diffMs / 1000) % 60);
      setElapsedText(`${diffMin}m ${diffSec}s`);

      // Thresholds: Warning and Critical from settings props
      const warnTime = alertThresholds?.warning || 15;
      const critTime = alertThresholds?.critical || 30;

      if (diffMin >= critTime) {
        setTimerAlertClass('critical');
      } else if (diffMin >= warnTime) {
        setTimerAlertClass('warning');
      } else {
        setTimerAlertClass('');
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [delivery.startTime, isCompleted, alertThresholds]);

  const handleCopyPhone = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(delivery.clientPhone);
    setCopyText('Copié !');
    setTimeout(() => setCopyText('Copier'), 2000);
  };

  const getInitials = (name) => {
    return name ? name.trim().charAt(0) : 'C';
  };

  const zoneLabel = delivery.deliveryZone === 'zone1' ? 'Zone 1' : delivery.deliveryZone === 'zone2' ? 'Zone 2' : 'Zone 3';
  const startTimeFormatted = new Date(delivery.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Format WhatsApp message link
  const cleanPhone = delivery.clientPhone.replace(/\D/g, '');
  // Using 225 prefix for Ivory Coast or fallback directly
  const waPrefix = cleanPhone.length === 8 || cleanPhone.length === 10 ? '225' : '';
  const waLink = `https://wa.me/${waPrefix}${cleanPhone}?text=${encodeURIComponent(`Bonjour ${delivery.clientName}, votre livreur est en chemin pour votre commande.`)}`;

  return (
    <li className={`delivery-item ${isCompleted ? 'status-completed' : 'status-pending'}`}>
      <div className="item-client-header">
        <div className="client-avatar">{getInitials(delivery.clientName)}</div>
        <div className="client-info-main" style={{ marginLeft: '0.75rem', flex: 1 }}>
          <h4>{delivery.clientName}</h4>
          <span>Tél: {delivery.clientPhone}</span>
        </div>
        <span className={`zone-tag ${delivery.deliveryZone}`}>{zoneLabel}</span>
      </div>

      <div className="item-details-grid">
        <div className="detail-row-lbl">Plat :</div>
        <div className="detail-row-val">{delivery.foodAmount} FCFA</div>

        <div className="detail-row-lbl">Paiement Plat :</div>
        <div className={`detail-row-val payment-badge ${delivery.foodPayment}`}>
          {delivery.foodPayment === 'izoua' ? 'Izoua' : 'Moi'}
        </div>

        <div className="detail-row-lbl">Frais Livr. :</div>
        <div className="detail-row-val">{delivery.deliveryCost} FCFA</div>

        <div className="detail-row-lbl">Paiement Livr. :</div>
        {isCompleted ? (
          <div className={`detail-row-val payment-badge ${delivery.deliveryPayment}`}>
            {delivery.deliveryPayment === 'izoua' ? 'Izoua' : 'Moi'}
          </div>
        ) : (
          <div className="detail-row-val" style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
            En attente
          </div>
        )}
      </div>

      <div className="item-time-footer">
        <span className="time-start">Départ: {startTimeFormatted}</span>
        {isCompleted ? (
          <div className="live-timer-container completed">
            <span>Durée: {delivery.duration} min</span>
          </div>
        ) : (
          <div className={`live-timer-container active ${timerAlertClass}`}>
            <div className="timer-dot"></div>
            <span className="live-timer-text">{elapsedText}</span>
          </div>
        )}
      </div>

      {/* Driver Shortcuts Panel */}
      <div className="card-shortcuts">
        <button type="button" className="btn-shortcut" onClick={handleCopyPhone}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          {copyText}
        </button>
        <a href={`tel:${delivery.clientPhone}`} className="btn-shortcut call">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          Appeler
        </a>
        <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-shortcut wa">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
          WhatsApp
        </a>
      </div>

      {!isCompleted && (
        <button className="btn-complete-course" onClick={onCompleteClick} style={{ marginTop: '0.25rem' }}>
          <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          Marquer Livrée
        </button>
      )}
    </li>
  );
}
