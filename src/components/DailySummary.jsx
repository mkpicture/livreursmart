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
              <div className="summary-card-text">
                <div className="card-title">Chez Izoua</div>
                <div className="card-value">{foodIzouaTotal.toLocaleString()} FCFA</div>
              </div>
              <svg className="summary-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <div className="summary-card moi">
              <div className="summary-card-text">
                <div className="card-title">Chez Moi</div>
                <div className="card-value">{foodMoiTotal.toLocaleString()} FCFA</div>
              </div>
              <svg className="summary-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
                <line x1="12" y1="18" x2="12" y2="6" />
                <line x1="6" y1="12" x2="18" y2="12" />
              </svg>
            </div>
          </div>
        </div>

        {/* Delivery Cards */}
        <div className="summary-group-box">
          <h3>Frais de Livraison</h3>
          <div className="summary-grid">
            <div className="summary-card izoua">
              <div className="summary-card-text">
                <div className="card-title">Chez Izoua</div>
                <div className="card-value">{deliveryIzouaTotal.toLocaleString()} FCFA</div>
              </div>
              <svg className="summary-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <div className="summary-card moi">
              <div className="summary-card-text">
                <div className="card-title">Chez Moi</div>
                <div className="card-value">{deliveryMoiTotal.toLocaleString()} FCFA</div>
              </div>
              <svg className="summary-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
                <line x1="12" y1="18" x2="12" y2="6" />
                <line x1="6" y1="12" x2="18" y2="12" />
              </svg>
            </div>
          </div>
        </div>

        {/* Visual SVG Donut chart of payment share */}
        <div className="summary-visual">
          <div className="visual-label" style={{ marginBottom: '0.25rem' }}>
            <span>Répartition du Chiffre d'Affaires</span>
          </div>
          
          <div className="donut-container">
            <svg width="130" height="130" viewBox="0 0 120 120" className="donut-svg">
              <defs>
                <linearGradient id="donut-grad-izoua" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
                <linearGradient id="donut-grad-moi" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
              
              <circle cx="60" cy="60" r="50" className="donut-ring-bg" />
              
              {grandTotal > 0 ? (
                <>
                  {/* Moi Segment (Green) */}
                  <circle 
                    cx="60" 
                    cy="60" 
                    r="50" 
                    className="donut-segment moi" 
                    strokeDasharray={`${(moiPct / 100) * 314.16} 314.16`}
                    strokeDashoffset={0}
                  />
                  {/* Izoua Segment (Orange) */}
                  <circle 
                    cx="60" 
                    cy="60" 
                    r="50" 
                    className="donut-segment izoua" 
                    strokeDasharray={`${(izouaPct / 100) * 314.16} 314.16`}
                    strokeDashoffset={-((moiPct / 100) * 314.16)}
                  />
                </>
              ) : (
                <circle 
                  cx="60" 
                  cy="60" 
                  r="50" 
                  className="donut-segment" 
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeDasharray="314.16 314.16"
                  strokeDashoffset={0}
                />
              )}
            </svg>
            
            <div className="donut-center-text">
              <span className="donut-center-val" style={{ fontSize: '0.9rem' }}>{grandTotal.toLocaleString()}</span>
              <span className="donut-center-lbl" style={{ fontSize: '0.55rem' }}>Total FCFA</span>
            </div>
          </div>

          <div className="visual-label" style={{ justifyContent: 'center', gap: '1rem', marginTop: '0.5rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 600 }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-warning)' }}></span>
              Izoua: {izouaPct}%
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 600 }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-success)' }}></span>
              Moi: {moiPct}%
            </span>
          </div>
        </div>

        {/* Grand Totals */}
        <div className="grand-total-box" style={{ marginTop: '0.5rem' }}>
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
