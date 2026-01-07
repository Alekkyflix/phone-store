import React, { useState } from 'react';
import { X } from 'lucide-react';
import { MOCK_PHONES } from '../../mockData';

// Modular Shop Components
import ShopNavbar from '../../components/shop/ShopNavbar';
import ShopHero from '../../components/shop/ShopHero';
import ProductGrid from '../../components/shop/ProductGrid';
import CheckoutModal from '../../components/shop/CheckoutModal';
import QuickViewModal from '../../components/shop/QuickViewModal';

/**
 * LandingPage Component
 * 
 * The primary customer-facing shop front. This component acts as the main orchestrator
 * for the shop experience, managing filtering logic, cart state, and modal visibility.
 * Now modularized for better maintainability.
 * 
 * @param {Object} props
 * @param {Object} props.n8nConfig - System configuration (shop name, webhook URL)
 * @param {number} props.techPoints - User points for gamification
 * @param {number} props.level - User tech level
 * @param {Function} props.addPoints - Function to award points
 * @param {Object[]} props.cartItems - Items currently in the cart
 * @param {number} props.cartCount - Total item count in cart
 * @param {Function} props.addToCart - Adds an item to the cart
 * @param {Function} props.removeFromCart - Removes an item from the cart
 * @param {Function} props.clearCart - Resets the cart
 * @param {Function} props.setCurrentView - Changes the main application view
 * @param {boolean} props.showCart - Controls cart modal visibility
 * @param {Function} props.setShowCart - Set cart modal visibility
 * @param {Object[]} props.liveInventory - Fetched live products from n8n
 */
const LandingPage = ({ 
  n8nConfig, 
  techPoints, 
  level, 
  addPoints, 
  cartItems, 
  cartCount, 
  addToCart, 
  removeFromCart, 
  clearCart, 
  setCurrentView,
  showCart,
  setShowCart,
  liveInventory = []
}) => {
  // --- Search & Filter State ---
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPhone, setSelectedPhone] = useState(null); // For QuickView modal
  
  // --- Checkout Process State ---
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [orderStatus, setOrderStatus] = useState('idle'); // idle, ordering, success
  const [errorStatus, setErrorStatus] = useState({ show: false, message: '' });

  const categories = ['All', 'Flagship', 'Mid-range', 'Budget', 'Used'];

  // Determine which items to show: Live inventory first, fallback to mock
  const itemsToDisplay = liveInventory.length > 0 ? liveInventory : MOCK_PHONES;

  /**
   * Filter logic for the phone grid
   */
  const filteredPhones = itemsToDisplay.filter(phone => {
    const matchesSearch = phone.model.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         phone.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || phone.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  /**
   * Handles the final submission of an order to the n8n webhook
   * 
   * @param {Object} customerData - Customer info (name, phone, email, etc.)
   */
  const handleOrderSubmit = async (customerData) => {
    if (!n8nConfig.webhookUrl) {
      setErrorStatus({ 
        show: true, 
        message: 'The shop is currently undergoing maintenance. Please try again in 5 minutes.' 
      });
      return;
    }

    if (!customerData.customerPhone?.startsWith('+')) {
      setErrorStatus({ 
        show: true, 
        message: 'Please provide your phone number starting with the country code (e.g., +254...)' 
      });
      return;
    }

    setOrderStatus('ordering');
    try {
      const payload = {
        action: 'order_submitted',
        source: 'customer',
        timestamp: new Date().toISOString(),
        phone: selectedPhone, // Single phone order context if any
        cartItems: cartItems.length > 0 ? cartItems : undefined,
        customer: {
          ...customerData,
          paymentMethod: paymentMethod
        }
      };

      const response = await fetch(n8nConfig.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setOrderStatus('success');
        addPoints(500); // Massive points for a successful order!
      } else {
        throw new Error('Order submission failed');
      }
    } catch (err) {
      setErrorStatus({ 
        show: true, 
        message: 'Connection lost. Please check your data and try one more time.' 
      });
      setOrderStatus('idle');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* 1. Navigation */}
      <ShopNavbar 
        shopName={n8nConfig.shopName}
        techPoints={techPoints}
        level={level}
        cartCount={cartCount}
        setCurrentView={setCurrentView}
        setShowCart={setShowCart}
      />

      {/* 2. Hero Section */}
      <ShopHero 
        level={level}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        addPoints={addPoints}
      />

      {/* 3. Product Display Area */}
      <ProductGrid 
        phones={filteredPhones}
        addToCart={addToCart}
        setSelectedPhone={setSelectedPhone}
        addPoints={addPoints}
      />

      {/* 4. Overlay Modals */}
      <QuickViewModal 
        phone={selectedPhone}
        onClose={() => setSelectedPhone(null)}
        addToCart={addToCart}
        setShowCart={setShowCart}
      />

      <CheckoutModal 
        showCart={showCart}
        setShowCart={setShowCart}
        cartItems={cartItems}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        handleOrderSubmit={handleOrderSubmit}
        orderStatus={orderStatus}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
      />

      {/* 5. Error Handler Overlay */}
      {errorStatus.show && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 text-center space-y-6 transform animate-in zoom-in slide-in-from-bottom-8 duration-500 border border-white/50">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-2 border-4 border-white shadow-xl">
              <X size={40} className="text-red-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900">Oops! Something went wrong</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                {errorStatus.message}
              </p>
            </div>
            <button
              onClick={() => setErrorStatus({ show: false, message: '' })}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-slate-200"
            >
              Try Again
            </button>
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
              Error Hash: {Math.random().toString(36).substring(7).toUpperCase()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
