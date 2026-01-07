import React from 'react';
import { X, ShoppingCart, Zap, Star } from 'lucide-react';
import SmartphoneIcon from '../common/SmartphoneIcon';

/**
 * QuickViewModal Component
 * 
 * Displays detailed information about a selected phone product.
 * Features a large visual icon, specs summary, and primary purchase action.
 * 
 * @param {Object} props
 * @param {Object} props.phone - The phone product to display
 * @param {Function} props.onClose - Closes the modal
 * @param {Function} props.addToCart - Adds the phone to the cart and opens it
 * @param {Function} props.setShowCart - Toggles the cart visibility
 */
const QuickViewModal = ({ phone, onClose, addToCart, setShowCart }) => {
  if (!phone) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="max-w-4xl w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row transform animate-in zoom-in slide-in-from-bottom-8 duration-500 border border-white/50">
        
        {/* Visual Section */}
        <div className="md:w-1/2 bg-slate-50 p-12 flex items-center justify-center relative">
          <button 
            onClick={onClose}
            className="md:hidden absolute top-6 right-6 p-2 bg-white rounded-full shadow-lg"
          >
            <X size={20} />
          </button>
          <div className="w-full aspect-square bg-white rounded-[3rem] flex items-center justify-center shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
            <SmartphoneIcon brand={phone.brand} size={120} />
          </div>
        </div>

        {/* Content Section */}
        <div className="md:w-1/2 p-10 md:p-14 relative flex flex-col">
          <button 
            onClick={onClose}
            className="hidden md:flex absolute top-8 right-8 p-3 hover:bg-slate-100 rounded-2xl transition-all"
          >
            <X size={24} className="text-slate-400" />
          </button>

          <div className="flex-1 space-y-8">
            <div className="space-y-2">
              <span className="text-sm font-black text-blue-600 uppercase tracking-[0.3em]">{phone.brand}</span>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">{phone.model}</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                  <Star size={16} className="text-amber-500 fill-amber-500" />
                  <span className="text-sm font-black text-amber-700">{phone.rating} / 5.0</span>
                </div>
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{phone.category} Class</span>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Pricing & Availability</h4>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black text-slate-900">Ksh {phone.price.toLocaleString()}</span>
                <span className="text-slate-400 font-bold line-through">Ksh {Math.round(phone.price * 1.1).toLocaleString()}</span>
              </div>
              <p className="text-slate-500 font-medium leading-relaxed">
                Experience the next generation of {phone.brand} technology. This {phone.category.toLowerCase()} model offers top-tier performance for tech enthusiasts.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
               <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Stock Status</p>
                  <p className="font-bold text-slate-700">{phone.stock > 0 ? 'In Stock ✓' : 'Out of Stock'}</p>
               </div>
               <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Reward Points</p>
                  <p className="font-bold text-blue-600">+150 XP</p>
               </div>
            </div>
          </div>

          <div className="pt-10 space-y-4">
            <button 
              onClick={() => { addToCart(phone); setShowCart(true); onClose(); }}
              className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-[0.98] group"
            >
              <ShoppingCart size={24} className="group-hover:translate-x-1 transition-transform" />
              Add to Cart & Checkout
            </button>
            <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] animate-pulse">
              🔥 Limited Stock - Earn +50 Tech points just for viewing
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
