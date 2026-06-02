import React, { useState, useEffect } from 'react';
import DeliveryForm from './components/DeliveryForm';
import DeliveryList from './components/DeliveryList';
import DailySummary from './components/DailySummary';
import PaymentModal from './components/PaymentModal';

export default function App() {
  const [deliveries, setDeliveries] = useState(() => {
    const stored = localStorage.getItem('deliveries');
    return stored ? JSON.parse(stored) : [];
  });

  const [clientsDirectory, setClientsDirectory] = useState(() => {
    const stored = localStorage.getItem('clientsDirectory');
    return stored ? JSON.parse(stored) : {};
  });

  // Global settings state
  const [settings, setSettings] = useState(() => {
    const stored = localStorage.getItem('deliverySettings');
    return stored ? JSON.parse(stored) : {
      zoneRates: { zone1: 1000, zone2: 1500, zone3: 2000 },
      alertThresholds: { warning: 15, critical: 30 },
      enableAudio: true
    };
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [modalState, setModalState] = useState({
    isOpen: false,
    clientName: '',
    index: null
  });

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('deliveries', JSON.stringify(deliveries));
  }, [deliveries]);

  useEffect(() => {
    localStorage.setItem('clientsDirectory', JSON.stringify(clientsDirectory));
  }, [clientsDirectory]);

  useEffect(() => {
    localStorage.setItem('deliverySettings', JSON.stringify(settings));
  }, [settings]);

  // Audio synthesizer chime using Web Audio API (zero file dependencies)
  const playChime = (type) => {
    if (!settings.enableAudio) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      if (type === 'success') {
        // High double beep synth chime
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc1.frequency.setValueAtTime(880.00, ctx.currentTime + 0.1); // A5
        gain1.gain.setValueAtTime(0.12, ctx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start();
        osc1.stop(ctx.currentTime + 0.4);
      } else if (type === 'complete') {
        // Success upward arpeggio
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc2.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
        osc2.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16); // G5
        osc2.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.24); // C6
        gain2.gain.setValueAtTime(0.15, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start();
        osc2.stop(ctx.currentTime + 0.5);
      }
    } catch (err) {
      console.warn("Audio Context blocked by browser permission:", err);
    }
  };

  const handleAddDelivery = (newDelivery) => {
    setDeliveries(prev => [...prev, newDelivery]);
    playChime('success');
    
    // Save client to directory
    const { clientPhone, clientName } = newDelivery;
    if (clientPhone && clientName) {
      setClientsDirectory(prev => ({
        ...prev,
        [clientPhone]: clientName
      }));
    }
  };

  const handleMarkDeliveredClick = (index) => {
    const delivery = deliveries[index];
    setModalState({
      isOpen: true,
      clientName: delivery.clientName,
      index: index
    });
  };

  const handleModalClose = () => {
    setModalState({
      isOpen: false,
      clientName: '',
      index: null
    });
  };

  const handleModalConfirm = (paymentMethod) => {
    const index = modalState.index;
    if (index === null) return;

    setDeliveries(prev => {
      const updated = [...prev];
      const delivery = updated[index];
      const endTime = new Date();
      const startTime = new Date(delivery.startTime);
      const duration = Math.max(1, Math.round((endTime - startTime) / 1000 / 60));

      updated[index] = {
        ...delivery,
        endTime: endTime.toISOString(),
        deliveryPayment: paymentMethod,
        duration: duration
      };
      return updated;
    });

    playChime('complete');
    handleModalClose();
  };

  const handleResetDay = () => {
    if (window.confirm('Voulez-vous vraiment réinitialiser toutes les livraisons de la journée ?')) {
      setDeliveries([]);
    }
  };

  // Settings handlers
  const handleSettingChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRateChange = (zone, value) => {
    setSettings(prev => ({
      ...prev,
      zoneRates: {
        ...prev.zoneRates,
        [zone]: Math.max(0, parseInt(value, 10) || 0)
      }
    }));
  };

  const handleThresholdChange = (level, value) => {
    setSettings(prev => ({
      ...prev,
      alertThresholds: {
        ...prev.alertThresholds,
        [level]: Math.max(1, parseInt(value, 10) || 1)
      }
    }));
  };

  // Dynamic KPI calculations
  const totalCount = deliveries.length;
  const activeCount = deliveries.filter(item => item.endTime === null).length;
  const completedCount = deliveries.filter(item => item.endTime !== null).length;

  const totalRevenue = deliveries.reduce((sum, item) => {
    // Food revenue
    let foodVal = item.foodAmount || 0;
    // Delivery revenue (only if completed)
    let delVal = item.endTime !== null ? (item.deliveryCost || 0) : 0;
    return sum + foodVal + delVal;
  }, 0);

  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 100;

  const avgDuration = (() => {
    const completed = deliveries.filter(item => item.endTime !== null);
    if (completed.length === 0) return 0;
    const totalDuration = completed.reduce((sum, item) => sum + (item.duration || 0), 0);
    return Math.round(totalDuration / completed.length);
  })();

  return (
    <>
      <header className="app-header">
        <div className="header-logo">
          <svg className="icon logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="3" width="15" height="13"></rect>
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
            <circle cx="5.5" cy="18.5" r="2.5"></circle>
            <circle cx="18.5" cy="18.5" r="2.5"></circle>
          </svg>
          <h1>Gestion de Livraison <span>Pro</span></h1>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="header-stats" style={{ display: 'none' }}>
            {/* Kept hidden, replaced by visual upper KPI row */}
          </div>
          
          <button className="btn-settings" onClick={() => setIsDrawerOpen(true)} title="Paramètres du tableau de bord">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </button>
        </div>
      </header>

      <main className="dashboard">
        {/* SaaS KPI row */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-card-content">
              <span className="kpi-label">Revenus Globaux</span>
              <span className="kpi-value">{totalRevenue.toLocaleString()}</span>
              <span className="kpi-desc">Plats + Livraisons payées</span>
            </div>
            <div className="kpi-icon-wrapper" style={{ color: 'var(--color-success)', borderColor: 'rgba(16, 185, 129, 0.15)', backgroundColor: 'rgba(16, 185, 129, 0.08)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"/><line x1="12" y1="18" x2="12" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/></svg>
            </div>
          </div>
          
          <div className="kpi-card">
            <div className="kpi-card-content">
              <span className="kpi-label">Volume Actif</span>
              <span className="kpi-value">{activeCount}</span>
              <span className="kpi-desc">Livraisons en cours de route</span>
            </div>
            <div className="kpi-icon-wrapper radar-ring" style={{ color: 'var(--color-warning)', borderColor: 'rgba(245, 158, 11, 0.15)', backgroundColor: 'rgba(245, 158, 11, 0.08)' }}>
              <div className="radar-pulse"></div>
              <div className="radar-dot"></div>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-card-content">
              <span className="kpi-label">Complétion</span>
              <span className="kpi-value">{completionRate}%</span>
              <span className="kpi-desc highlight-green">{completedCount} sur {totalCount} terminées</span>
            </div>
            <div className="kpi-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-card-content">
              <span className="kpi-label">Temps Moyen</span>
              <span className="kpi-value">{avgDuration} <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>min</span></span>
              <span className="kpi-desc">Par livraison complétée</span>
            </div>
            <div className="kpi-icon-wrapper" style={{ color: '#a78bfa', borderColor: 'rgba(167, 139, 250, 0.15)', backgroundColor: 'rgba(167, 139, 250, 0.08)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <DeliveryForm 
            clientsDirectory={clientsDirectory} 
            onAddDelivery={handleAddDelivery} 
            zoneRates={settings.zoneRates}
          />
          
          <DeliveryList 
            deliveries={deliveries} 
            onMarkDeliveredClick={handleMarkDeliveredClick} 
            alertThresholds={settings.alertThresholds}
          />
          
          <DailySummary 
            deliveries={deliveries} 
            onResetDay={handleResetDay} 
          />
        </div>
      </main>

      <PaymentModal 
        isOpen={modalState.isOpen}
        clientName={modalState.clientName}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
      />

      {/* Settings Drawer Panel */}
      {isDrawerOpen && (
        <div className="drawer-overlay" onClick={() => setIsDrawerOpen(false)}>
          <div className="drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h2>Paramètres Généraux</h2>
              <button className="btn-drawer-close" onClick={() => setIsDrawerOpen(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div className="drawer-body">
              {/* Custom Rates section */}
              <div className="drawer-section">
                <h3>Tarifs de Livraison par Zone</h3>
                
                <div className="form-group">
                  <label htmlFor="settings-zone1">Zone 1 (FCFA)</label>
                  <input 
                    type="number" 
                    id="settings-zone1" 
                    value={settings.zoneRates.zone1}
                    onChange={(e) => handleRateChange('zone1', e.target.value)}
                    min="0"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="settings-zone2">Zone 2 (FCFA)</label>
                  <input 
                    type="number" 
                    id="settings-zone2" 
                    value={settings.zoneRates.zone2}
                    onChange={(e) => handleRateChange('zone2', e.target.value)}
                    min="0"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="settings-zone3">Zone 3 (FCFA)</label>
                  <input 
                    type="number" 
                    id="settings-zone3" 
                    value={settings.zoneRates.zone3}
                    onChange={(e) => handleRateChange('zone3', e.target.value)}
                    min="0"
                  />
                </div>
              </div>

              {/* Threshold Alarms section */}
              <div className="drawer-section">
                <h3>Alertes de Retard (Chronomètre)</h3>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="settings-warn">Alerte Orange (min)</label>
                    <input 
                      type="number" 
                      id="settings-warn" 
                      value={settings.alertThresholds.warning}
                      onChange={(e) => handleThresholdChange('warning', e.target.value)}
                      min="1"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="settings-crit">Alerte Rouge (min)</label>
                    <input 
                      type="number" 
                      id="settings-crit" 
                      value={settings.alertThresholds.critical}
                      onChange={(e) => handleThresholdChange('critical', e.target.value)}
                      min="1"
                    />
                  </div>
                </div>
              </div>

              {/* Sound signals settings */}
              <div className="drawer-section">
                <h3>Signaux Sonores</h3>
                
                <div className="toggle-group">
                  <div className="toggle-label">
                    <span>Sons de Notification</span>
                    <p>Jouer des bips lors des enregistrements</p>
                  </div>
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={settings.enableAudio} 
                      onChange={(e) => handleSettingChange('enableAudio', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>

            <div className="drawer-footer">
              <button className="btn-primary" onClick={() => setIsDrawerOpen(false)} style={{ width: '100%', margin: 0 }}>
                Enregistrer & Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
