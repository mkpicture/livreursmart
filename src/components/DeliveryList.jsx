import React, { useState } from 'react';
import DeliveryCard from './DeliveryCard';

export default function DeliveryList({ deliveries, onMarkDeliveredClick, alertThresholds }) {
  const [currentFilter, setCurrentFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter deliveries
  const filtered = deliveries.filter((item) => {
    // Filter by status
    const matchesStatus =
      currentFilter === 'all' ||
      (currentFilter === 'pending' && item.endTime === null) ||
      (currentFilter === 'completed' && item.endTime !== null);

    // Filter by search text
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      item.clientName.toLowerCase().includes(query) ||
      item.clientPhone.includes(query) ||
      item.deliveryZone.toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });

  const activeCount = deliveries.filter(item => item.endTime === null).length;

  return (
    <section className="panel panel-list">
      <div className="panel-header">
        <div className="list-title-area">
          <h2>Suivi des Courses</h2>
          <span className="badge" id="list-count">{activeCount} en cours</span>
        </div>
        <div className="search-filter-bar">
          <div className="search-box">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input 
              type="text" 
              placeholder="Rechercher client ou tél..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="filter-tabs">
            <button 
              className={`filter-tab ${currentFilter === 'all' ? 'active' : ''}`}
              onClick={() => setCurrentFilter('all')}
            >
              Tous
            </button>
            <button 
              className={`filter-tab ${currentFilter === 'pending' ? 'active' : ''}`}
              onClick={() => setCurrentFilter('pending')}
            >
              En Cours
            </button>
            <button 
              className={`filter-tab ${currentFilter === 'completed' ? 'active' : ''}`}
              onClick={() => setCurrentFilter('completed')}
            >
              Livrées
            </button>
          </div>
        </div>
      </div>

      <div className="delivery-list-container">
        {filtered.length === 0 ? (
          <div className="empty-state" id="empty-state">
            <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="9" y1="9" x2="15" y2="9" />
              <line x1="9" y1="13" x2="15" y2="13" />
              <line x1="9" y1="17" x2="11" y2="17" />
            </svg>
            <p>Aucune livraison enregistrée</p>
          </div>
        ) : (
          <ul id="delivery-list" className="delivery-grid-list">
            {filtered.map((item) => {
              const originalIndex = deliveries.indexOf(item);
              return (
                <DeliveryCard
                  key={`${item.startTime}-${originalIndex}`}
                  delivery={item}
                  onCompleteClick={() => onMarkDeliveredClick(originalIndex)}
                  alertThresholds={alertThresholds}
                />
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
