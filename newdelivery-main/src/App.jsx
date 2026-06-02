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

  const [modalState, setModalState] = useState({
    isOpen: false,
    clientName: '',
    index: null
  });

  const handleAddDelivery = (newDelivery) => {
    setDeliveries(prev => [...prev, newDelivery]);
    
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
      const duration = Math.round((endTime - startTime) / 1000 / 60);

      updated[index] = {
        ...delivery,
        endTime: endTime.toISOString(),
        deliveryPayment: paymentMethod,
        duration: duration
      };
      return updated;
    });

    handleModalClose();
  };

  const handleResetDay = () => {
    if (window.confirm('Voulez-vous vraiment réinitialiser toutes les livraisons de la journée ?')) {
      setDeliveries([]);
    }
  };

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('deliveries', JSON.stringify(deliveries));
  }, [deliveries]);

  useEffect(() => {
    localStorage.setItem('clientsDirectory', JSON.stringify(clientsDirectory));
  }, [clientsDirectory]);

  // Compute metrics for header
  const totalCount = deliveries.length;
  const activeCount = deliveries.filter(item => item.endTime === null).length;
  const completedCount = deliveries.filter(item => item.endTime !== null).length;

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
        <div className="header-stats">
          <div className="stat-bubble">
            <span className="bubble-label">Total</span>
            <span className="bubble-val">{totalCount}</span>
          </div>
          <div className="stat-bubble active">
            <span className="bubble-label">En Cours</span>
            <span className="bubble-val">{activeCount}</span>
          </div>
          <div className="stat-bubble completed">
            <span className="bubble-label">Livrées</span>
            <span className="bubble-val">{completedCount}</span>
          </div>
        </div>
      </header>

      <main className="dashboard">
        <div className="dashboard-grid">
          <DeliveryForm 
            clientsDirectory={clientsDirectory} 
            onAddDelivery={handleAddDelivery} 
          />
          
          <DeliveryList 
            deliveries={deliveries} 
            onMarkDeliveredClick={handleMarkDeliveredClick} 
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
    </>
  );
}
