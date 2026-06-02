import React from 'react';

export default function DailySummary({ deliveries, onResetDay }) {
  let foodIzouaTotal = 0;
  let foodMoiTotal = 0;
  let deliveryIzouaTotal = 0;
  let deliveryMoiTotal = 0;

  deliveries.forEach(item => {
    // Food Payment
    if (item.foodPayment === 'izoua') {
      foodIzouaTotal += item.foodAmount;
    } else if (item.foodPayment === 'moi') {
      foodMoiTotal += item.foodAmount;
    }

    // Delivery Payment (only if completed)
    if (item.endTime !== null) {
      if (item.deliveryPayment === 'izoua') {
        deliveryIzouaTotal += item.deliveryCost;
      } else if (item.deliveryPayment === 'moi') {
        deliveryMoiTotal += item.deliveryCost;
      }
    }
  });

  const grandTotal = foodIzouaTotal + foodMoiTotal + deliveryIzouaTotal + deliveryMoiTotal;
  const izouaTotal = foodIzouaTotal + deliveryIzouaTotal;
  const moiTotal = foodMoiTotal + deliveryMoiTotal;

  let moiRatio = 50;
  let izouaRatio = 50;

  if (grandTotal > 0) {
    moiRatio = Math.round((moiTotal / grandTotal) * 100);
    izouaRatio = 100 - moiRatio;
  }

  return (
    <section className="panel panel-summary">
      <div className="panel-header">
        <h2>Bilan de la Journée</h2>
        <p>Suivi en temps réel des encaissements</p>
      </div>

      <div className="summary-cards">
        {/* Food Cards */}
        <div className="summary-group-box">
          <h3>Plats & Nourriture</h3>
          <div className="summary-grid">
            <div className="summary-card izoua">
              <div className="card-title">Chez Izoua</div>
              <div className="card-value">{foodIzouaTotal.toLocaleString()} FCFA</div>
            </div>
            <div className="summary-card moi">
              <div className="card-title">Chez Moi</div>
              <div className="card-value">{foodMoiTotal.toLocaleString()} FCFA</div>
            </div>
          </div>
        </div>

        {/* Delivery Cards */}
        <div className="summary-group-box">
          <h3>Frais de Livraison</h3>
          <div className="summary-grid">
            <div className="summary-card izoua">
              <div className="card-title">Chez Izoua</div>
              <div className="card-value">{deliveryIzouaTotal.toLocaleString()} FCFA</div>
            </div>
            <div className="summary-card moi">
              <div className="card-title">Chez Moi</div>
              <div className="card-value">{deliveryMoiTotal.toLocaleString()} FCFA</div>
            </div>
          </div>
        </div>

        {/* Visual Progress bar of payment share */}
        <div className="summary-visual">
          <div className="visual-label">
            <span>Répartition Izoua / Moi</span>
            <span id="ratio-text">{izouaRatio}% Izoua / {moiRatio}% Moi</span>
          </div>
          <div className="ratio-bar-bg">
            <div className="ratio-bar-fill" style={{ width: `${moiRatio}%` }}></div>
          </div>
        </div>

        {/* Grand Totals */}
        <div className="grand-total-box">
          <div className="total-row">
            <span>Total Général Collecté :</span>
            <strong>{grandTotal.toLocaleString()} FCFA</strong>
          </div>
        </div>
      </div>

      <button id="reset-day-btn" className="btn-secondary" onClick={onResetDay}>
        <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
          <path d="M21 3v5h-5" />
          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
          <path d="M3 21v-5h5" />
        </svg>
        Nouvelle Journée
      </button>
    </section>
  );
}
