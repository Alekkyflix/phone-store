import React from 'react';
import { Star, Flame, Zap, Plus } from 'lucide-react';
import SmartphoneIcon from '../common/SmartphoneIcon';

/**
 * PhoneCard Component
 * 
 * Displays an individual product card with pricing, rating, and action buttons.
 * 
 * @param {Object} props
 * @param {Object} props.phone - The phone product data
 * @param {Function} props.addToCart - Adds the phone to the shopping cart
 * @param {Function} props.setSelectedPhone - Opens the detail modal for this phone
 * @param {Function} props.addPoints - Function to award interaction points
 */
const PhoneCard = ({ phone, addToCart, setSelectedPhone, addPoints }) => {
  // Logic for NEW badge (added in last 48 hours)
  const isNewlyAdded = phone.isNew || (phone.timestamp && (new Date() - new Date(phone.timestamp) < 48 * 60 * 60 * 1000));

  return (
    <div 
      className="group bg-white rounded-[2.5rem] p-6 border border-slate-100 hover:border-blue-200 transition-all hover:shadow-2xl hover:shadow-blue-100/50 hover:-translate-y-2 relative overflow-hidden"
    >
      {/* NEW Badge */}
      {isNewlyAdded && (
        <div className={`absolute top-4 ${phone.category === 'Flagship' ? 'left-24' : 'left-4'} z-10 bg-blue-600 text-white text-[10px] font-black px-2.5 py-1 rounded-md flex items-center gap-1 shadow-lg shadow-blue-200 animate-in zoom-in duration-500`}>
          <Zap size={10} fill="currentColor" /> NEW
        </div>
      )}

      {/* Product Image / Icon Container */}
      <div className="relative aspect-square mb-6 bg-slate-50 rounded-[2rem] flex items-center justify-center overflow-hidden group-hover:bg-blue-50 transition-colors">
        <div className="transform group-hover:scale-110 transition-transform duration-500">
          <SmartphoneIcon brand={phone.brand} />
        </div>
        
        {/* Category Tag */}
        <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-black text-slate-500 border border-slate-100 shadow-sm">
          {phone.category.toUpperCase()}
        </div>
      </div>

      {/* Brand & Model */}
      <div className="space-y-1 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{phone.brand}</span>
          {phone.rating > 4.8 && <Flame size={12} className="text-orange-500" />}
        </div>
        <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
          {phone.model}
        </h3>
      </div>

      {/* Specs & Rating */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-1">
          <Star size={14} className="text-amber-400 fill-amber-400" />
          <span className="text-sm font-black text-slate-700">{phone.rating}</span>
        </div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
          {phone.stock > 0 ? `${phone.stock} units left` : 'Out of stock'}
        </div>
      </div>

      {/* Price & Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-400 line-through">Ksh {Math.round(phone.price * 1.1).toLocaleString()}</span>
          <span className="text-lg font-black text-slate-900">Ksh {phone.price.toLocaleString()}</span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => { setSelectedPhone(phone); addPoints(5); }}
            className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-900 hover:text-white transition-all active:scale-90"
            aria-label="View Details"
          >
            <Plus size={20} />
          </button>
          <button 
            onClick={() => { addToCart(phone); addPoints(10); }}
            className="p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 hover:scale-110 transition-all active:scale-90"
            aria-label="Add to Cart"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhoneCard;
