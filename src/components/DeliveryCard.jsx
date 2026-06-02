import React, { useState, useEffect } from 'react';

export default function DeliveryCard({ delivery, onCompleteClick }) {
  const [elapsedText, setElapsedText] = useState('0m 0s');
  const [timerAlertClass, setTimerAlertClass] = useState('');
  const isCompleted = delivery.endTime !== null;

  useEffect(() => {
    if (isCompleted) return;

    const updateTimer = () => {
      const start = new Date(delivery.startTime);
      const diffMs = new Date() - start;
      const diffMin = Math.floor(diffMs / 1000 / 60);
      const diffSec = Math.floor((diffMs / 1000) % 60);
      setElapsedText(`${diffMin}m ${diffSec}s`);

      // Thresholds: Warning at 15m, Critical at 30m
      if (diffMin >= 30) {
        setTimerAlertClass('critical');
      } else if (diffMin >= 15) {
        setTimerAlertClass('warning');
      } else {
        setTimerAlertClass('');
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [delivery.startTime, isCompleted]);

  const zoneLabel = delivery.deliveryZone === 'zone1' ? 'Zone 1' : delivery.deliveryZone === 'zone2' ? 'Zone 2' : 'Zone 3';
  const startTimeFormatted = new Date(delivery.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <li className={`delivery-item ${isCompleted ? 'status-completed' : 'status-pending'}`}>
      <div className="item-client-header">
        <div className="client-info-main">
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

      {!isCompleted && (
        <button className="btn-complete-course" onClick={onCompleteClick}>
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
