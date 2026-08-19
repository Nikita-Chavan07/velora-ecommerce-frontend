import React from 'react';
import { useSearchParams } from 'react-router-dom';
import ShopPage from './ShopPage';

const FashionPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const gender = searchParams.get('gender') ?? undefined;

  return (
    <ShopPage
      defaultCategory="fashion"
      defaultGender={gender}
      pageTitle={gender === 'men' ? "Men's Fashion" : gender === 'women' ? "Women's Fashion" : 'Fashion'}
      heroImage="https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=1600&q=80"
    />
  );
};

export default FashionPage;
