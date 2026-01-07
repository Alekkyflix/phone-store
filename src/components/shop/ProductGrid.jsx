import React from 'react';
import PhoneCard from './PhoneCard';

/**
 * ProductGrid Component
 * 
 * Renders the responsive grid of phone products. Handles the empty state when no products match filters.
 * 
 * @param {Object} props
 * @param {Object[]} props.phones - Array of phone products to display
 * @param {Function} props.addToCart - Passed to PhoneCard
 * @param {Function} props.setSelectedPhone - Passed to PhoneCard
 * @param {Function} props.addPoints - Passed to PhoneCard
 */
const ProductGrid = ({ phones, addToCart, setSelectedPhone, addPoints }) => {
  if (phones.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="bg-slate-50 inline-flex p-8 rounded-[3rem] mb-6">
          <div className="bg-white p-6 rounded-[2rem] shadow-xl text-4xl">🔍</div>
        </div>
        <h3 className="text-2xl font-black text-slate-900 mb-2">No models found</h3>
        <p className="text-slate-500 font-medium">Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 pb-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {phones.map(phone => (
          <PhoneCard 
            key={phone.productId || phone.model} 
            phone={phone}
            addToCart={addToCart}
            setSelectedPhone={setSelectedPhone}
            addPoints={addPoints}
          />
        ))}
      </div>
    </main>
  );
};

export default ProductGrid;
