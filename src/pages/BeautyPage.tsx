import React from 'react';
import ShopPage from './ShopPage';

const BeautyPage: React.FC = () => {
  return (
    <ShopPage
      defaultCategory="skincare"
      pageTitle="Beauty & Skincare"
      heroImage="https://images.unsplash.com/photo-1556228578-567ba127dbc1?w=1600&q=80"
    />
  );
};

export default BeautyPage;
