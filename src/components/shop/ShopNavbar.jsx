import React from 'react';
import { Phone, Zap, Award, ShoppingCart } from 'lucide-react';

/**
 * ShopNavbar Component
 * 
 * A premium, gamified navigation bar for the phone store.
 * Displays shop branding, user tech points/level, and provides access to the cart and staff portal.
 * 
 * @param {Object} props
 * @param {string} props.shopName - The name of the shop (e.g., from n8nConfig)
 * @param {number} props.techPoints - Current points earned by the user
 * @param {number} props.level - Current user level based on interactions
 * @param {number} props.cartCount - Total number of items currently in the cart
 * @param {Function} props.setCurrentView - Navigates between views (landing, login)
 * @param {Function} props.setShowCart - Toggles the visibility of the cart overlay
 */
const ShopNavbar = ({ 
  shopName, 
  techPoints, 
  level, 
  cartCount, 
  setCurrentView, 
  setShowCart 
}) => {
  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3">
      <div className="container mx-auto flex justify-between items-center">
        {/* Brand & Call to Order */}
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
             <Phone className="text-white" size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent leading-none">
              {shopName?.toUpperCase() || 'PHONE STORE'}
            </span>
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-0.5 ml-0.5">
              Call to Order: +254 7XX XXX XXX
            </span>
          </div>
        </div>

        {/* Gamification Stats & Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full border border-slate-200">
            <Zap size={18} className="text-amber-500 fill-amber-500" />
            <span className="font-bold text-slate-700">{techPoints} Points</span>
          </div>
          <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100">
            <Award size={18} className="text-indigo-600" />
            <span className="font-bold text-indigo-700">Lvl {level}</span>
          </div>
          <button 
            onClick={() => setCurrentView('login')}
            className="text-slate-500 hover:text-blue-600 font-semibold transition-colors"
          >
            Staff Access
          </button>
        </div>

        {/* Cart Toggle */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowCart(true)}
            className="relative p-2 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors group"
            aria-label="View Cart"
          >
             <ShoppingCart size={24} className="text-slate-600 group-hover:text-blue-600 transition-colors" />
             {cartCount > 0 && (
               <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-bounce-subtle">
                 {cartCount}
               </span>
             )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default ShopNavbar;
