import React, { createContext, useContext, useState } from 'react';
import type { Order } from '../types';

interface OrderContextType {
  currentOrder: Order | null;
  setCurrentOrder: (order: Order | null) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  return (
    <OrderContext.Provider value={{ currentOrder, setCurrentOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrder must be used within OrderProvider');
  return ctx;
};
