import React, { useState, useEffect } from 'react';

const zoneCosts = {
  zone1: 1000,
  zone2: 1500,
  zone3: 2000
};

export default function DeliveryForm({ clientsDirectory, onAddDelivery }) {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [zone, setZone] = useState('zone1');
  const [cost, setCost] = useState(1000);
  const [amount, setAmount] = useState('');
  const [payment, setPayment] = useState('izoua');
  const [showBadge, setShowBadge] = useState(false);

  // Capitalize first letters helper
  const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, char => char.toUpperCase());
  };

  // Force phone inputs to be numeric only
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, '');
    setPhone(numericValue);
  };

  // Capitalize name words when the user blurs out of the input
  const handleNameBlur = () => {
    setName(prev => capitalizeWords(prev));
  };

  // Phone input effect for autocompletion
  useEffect(() => {
    const cleanedPhone = phone.trim();
    if (cleanedPhone.length >= 3 && clientsDirectory[cleanedPhone]) {
      setName(clientsDirectory[cleanedPhone]);
      setShowBadge(true);
    } else {
      setShowBadge(false);
    }
  }, [phone, clientsDirectory]);

  // Zone select effect to update default cost
  const handleZoneChange = (e) => {
    const selectedZone = e.target.value;
    setZone(selectedZone);
    setCost(zoneCosts[selectedZone] || 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !amount) return;

    // Final capitalization fallback
    const formattedName = capitalizeWords(name.trim());

    onAddDelivery({
      clientName: formattedName,
      clientPhone: phone.trim(),
      deliveryZone: zone,
      deliveryCost: Math.max(0, parseInt(cost, 10) || 0),
      foodAmount: Math.max(0, parseInt(amount, 10) || 0),
      foodPayment: payment,
      startTime: new Date().toISOString(),
      endTime: null,
      duration: null,
      deliveryPayment: null
    });

    // Reset Form
    setPhone('');
    setName('');
    setZone('zone1');
    setCost(1000);
    setAmount('');
    setPayment('izoua');
    setShowBadge(false);
  };

  return (
    <section className="panel panel-form">
      <div className="panel-header">
        <h2>Nouvelle Livraison</h2>
        <p>Enregistrez une commande en quelques clics</p>
      </div>
      
      <form id="delivery-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="client-phone">
            <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            Téléphone du Client
          </label>
          <div className={`input-wrapper ${showBadge ? 'has-match-glow' : ''}`}>
            <input 
              type="tel" 
              id="client-phone" 
              placeholder="ex: 07070707" 
              required 
              autoComplete="off"
              value={phone}
              onChange={handlePhoneChange}
            />
            {showBadge && <span className="autocomplete-badge" id="phone-match-badge">Client connu</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="client-name">
            <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Nom du Client
          </label>
          <input 
            type="text" 
            id="client-name" 
            placeholder="Nom complet" 
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleNameBlur}
          />
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="delivery-zone">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Zone de Livraison
            </label>
            <select id="delivery-zone" value={zone} onChange={handleZoneChange} required>
              <option value="zone1">Zone 1 - 1000 FCFA</option>
              <option value="zone2">Zone 2 - 1500 FCFA</option>
              <option value="zone3">Zone 3 - 2000 FCFA</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="delivery-cost">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              Frais (FCFA)
            </label>
            <input 
              type="number" 
              id="delivery-cost" 
              value={cost} 
              onChange={(e) => setCost(e.target.value)}
              required 
              min="0"
            />
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="food-amount">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
                <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
                <line x1="6" y1="6" x2="6.01" y2="6" />
                <line x1="6" y1="18" x2="6.01" y2="18" />
              </svg>
              Nourriture (FCFA)
            </label>
            <input 
              type="number" 
              id="food-amount" 
              placeholder="Montant plat" 
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
            />
          </div>

          <div className="form-group">
            <label htmlFor="food-payment">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
              Paiement Nourriture
            </label>
            <select id="food-payment" value={payment} onChange={(e) => setPayment(e.target.value)} required>
              <option value="izoua">Chez Izoua</option>
              <option value="moi">Chez Moi</option>
            </select>
          </div>
        </div>

        <button type="submit" className="btn-primary">
          <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Ajouter la Livraison
        </button>
      </form>
    </section>
  );
}
