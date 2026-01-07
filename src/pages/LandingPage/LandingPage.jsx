import React, { useState } from 'react';
import { 
  Phone, 
  Package, 
  CheckCircle, 
  Zap, 
  ShoppingCart, 
  X, 
  Award, 
  Flame, 
  Search, 
  Star, 
  Plus, 
  Loader2,
  User,
  Mail,
  RefreshCw,
  CreditCard,
  Wallet,
  Banknote,
  Smartphone
} from 'lucide-react';
import { MOCK_PHONES } from '../../mockData';
import SmartphoneIcon from '../../components/common/SmartphoneIcon';
import { getWebhookUrl } from '../../utils/config';

/**
 * LandingPage Component
 * The primary customer-facing shop front.
 * Handles product browsing, searching, filtering, and the order/checkout flow.
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
  showConfetti,
  showCart,
  setShowCart,
  liveInventory = [],
  onRefresh,
  isRefreshing
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPhone, setSelectedPhone] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [orderStatus, setOrderStatus] = useState('idle'); // idle, ordering, success
  const [errorStatus, setErrorStatus] = useState({ show: false, message: '' });

  const categories = ['All', 'Flagship', 'Mid-range', 'Budget', 'Used'];

  // Determine which items to show: Live inventory first, fallback to mock
  const itemsToDisplay = liveInventory.length > 0 ? liveInventory : MOCK_PHONES;

  // Filter logic for the phone grid
  const filteredPhones = itemsToDisplay.filter(phone => {
    const matchesSearch = phone.model.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         phone.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || phone.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  /**
   * Handles the final submission of an order to the n8n webhook
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
      console.log('Initiating checkout with URL:', n8nConfig.webhookUrl);
      const payload = {
        action: 'order_submitted',
        source: 'customer',
        timestamp: new Date().toISOString(),
        phone: selectedPhone, // Single phone order context
        cartItems: cartItems.length > 0 ? cartItems : undefined,
        customer: {
          ...customerData,
          paymentMethod: paymentMethod
        }
      };
      
      console.log('Order payload:', payload);

      const finalUrl = getWebhookUrl(n8nConfig.webhookUrl);
      
      const response = await fetch(finalUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        console.log('Order submission successful');
        setOrderStatus('success');
        addPoints(100, 'First Order');
        clearCart(); 
        setShowCart(false); 
      } else {
        const errorText = await response.text();
        console.error('Order submission failed with status:', response.status, errorText);
        throw new Error(`Order failed: ${response.status}`);
      }
    } catch (error) {
      console.error('Checkout Technical Error:', {
        message: error.message,
        url: n8nConfig.webhookUrl,
        stack: error.stack
      });
      
      setErrorStatus({ 
        show: true, 
        message: 'Something went wrong while processing your order. Our team has been notified.' 
      });
      setOrderStatus('idle');
    }
  };

  /**
   * Success View Template
   */
  if (orderStatus === 'success') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 text-center space-y-6 transform animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={64} className="text-green-600" />
          </div>
          <h2 className="text-4xl font-bold text-gray-800">Order Verified!</h2>
          <p className="text-gray-600 text-lg">
            Thank you for your purchase. Our team will contact you shortly via WhatsApp for delivery.
          </p>
          <div className="bg-blue-50 p-4 rounded-xl flex items-center justify-center gap-3">
            <Zap className="text-blue-600" size={24} />
            <span className="font-bold text-blue-700">+100 Tech Points Earned!</span>
          </div>
          <button
            onClick={() => { setOrderStatus('idle'); setSelectedPhone(null); }}
            className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-black transition-all"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Level Up Celebration */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center overflow-hidden">
          <div className="text-6xl animate-bounce">🎊 LEVEL UP! 🎊</div>
        </div>
      )}

      {/* Floating Cart Button */}
      <button 
        onClick={() => setShowCart(true)}
        className="fixed bottom-8 right-8 z-50 bg-blue-600 text-white p-4 rounded-2xl shadow-2xl shadow-blue-300 hover:scale-110 transition-transform active:scale-95 flex items-center gap-3"
      >
        <div className="relative">
          <ShoppingCart size={24} />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-blue-600">
              {cartCount}
            </span>
          )}
        </div>
        {cartCount > 0 && <span className="font-bold pr-2">Ksh {cartItems.reduce((sum, item) => sum + item.price, 0).toLocaleString()}</span>}
      </button>

      {/* Glassmorphism Checkout Modal */}
      {showCart && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white/70 backdrop-blur-2xl border border-white/40 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
              <div className="p-8">
                 <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                      <ShoppingCart className="text-blue-600" /> Your Cart
                    </h3>
                    <button onClick={() => setShowCart(false)} className="p-2 hover:bg-slate-200/50 rounded-full transition-colors">
                      <X size={24} />
                    </button>
                 </div>

                 <div className="max-h-[40vh] overflow-y-auto space-y-4 mb-8 pr-2 custom-scrollbar">
                    {cartItems.length === 0 ? (
                      <div className="text-center py-12 text-slate-500">
                        <Package size={48} className="mx-auto mb-4 opacity-20" />
                        <p className="font-bold">Your cart is empty</p>
                        <p className="text-sm">Add some tech to get started!</p>
                      </div>
                    ) : (
                      cartItems.map((item, idx) => (
                        <div key={idx} className="bg-white/50 backdrop-blur-sm border border-white/50 p-4 rounded-2xl flex items-center gap-4 group animate-in slide-in-from-bottom-2">
                           <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm overflow-hidden">
                              {item.images && item.images[0] ? (
                                <img src={item.images[0]} alt={item.model} className="w-full h-full object-cover" />
                              ) : (
                                <SmartphoneIcon size={32} className="text-blue-500" />
                              )}
                           </div>
                           <div className="flex-1">
                              <h4 className="font-black text-slate-800">{item.model}</h4>
                              <p className="text-sm font-bold text-blue-600">Ksh {item.price.toLocaleString()}</p>
                           </div>
                           <button onClick={() => removeFromCart(idx)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                              <X size={18} />
                           </button>
                        </div>
                      ))
                    )}
                 </div>

                 {cartItems.length > 0 && (
                   <div className="space-y-6">
                      <div className="flex justify-between items-end border-t border-slate-200/50 pt-6">
                         <span className="text-slate-500 font-bold uppercase text-xs tracking-widest">Grand Total</span>
                         <span className="text-3xl font-black text-slate-900">Ksh {cartItems.reduce((sum, item) => sum + item.price, 0).toLocaleString()}</span>
                      </div>

                      {orderStatus === 'ordering' ? (
                        <div className="bg-blue-600/10 p-6 rounded-2xl flex flex-col items-center gap-3">
                           <Loader2 size={32} className="animate-spin text-blue-600" />
                           <span className="font-bold text-blue-700">Verifying your transaction...</span>
                        </div>
                      ) : (
                        <form onSubmit={(e) => {
                          e.preventDefault();
                          const formData = new FormData(e.target);
                          handleOrderSubmit(Object.fromEntries(formData));
                        }} className="space-y-6">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              <div className="space-y-1">
                                <label className="premium-label">Full Name</label>
                                <div className="relative group">
                                  <User className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                                  <input 
                                    name="name" 
                                    required 
                                    placeholder="Enter your name" 
                                    className="premium-input" 
                                  />
                                </div>
                              </div>

                              <div className="space-y-1">
                                <label className="premium-label">WhatsApp Number</label>
                                <div className="relative group">
                                  <Phone className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                                  <input 
                                    name="customerPhone" 
                                    required 
                                    placeholder="+254..." 
                                    pattern="^\+.*"
                                    title="Please include country code starting with +"
                                    className="premium-input" 
                                  />
                                </div>
                                <p className="text-[8px] text-blue-600 font-black uppercase tracking-tighter ml-2 opacity-70">Include country code (+254...)</p>
                              </div>
                           </div>

                           <div className="space-y-1">
                             <label className="premium-label">Email Address</label>
                             <div className="relative group">
                               <Mail className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                               <input 
                                 name="email" 
                                 type="email" 
                                 required 
                                 placeholder="your@email.com" 
                                 className="premium-input" 
                               />
                             </div>
                           </div>

                           <div className="flex items-center gap-4 px-4 py-3 bg-slate-50/50 rounded-2xl border border-slate-100 border-dashed">
                             <input 
                               type="checkbox" 
                               id="subscribeToOffers" 
                               name="subscribeToOffers" 
                               defaultChecked
                               className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                             />
                             <label htmlFor="subscribeToOffers" className="text-xs font-bold text-slate-500 cursor-pointer select-none leading-relaxed">
                               I want to receive tech updates, exclusive offers and order confirmations.
                             </label>
                           </div>
                          <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                             <Zap size={20} className="fill-white" /> Complete Checkout
                          </button>
                          <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest bg-slate-100/50 py-2 rounded-lg">
                             Earn +{cartItems.length * 100} tech points upon verification
                          </p>
                        </form>
                      )}
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* Gamified Navbar */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
               <Phone className="text-white" size={24} />
            </div>
            <span className="text-xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {n8nConfig.shopName.toUpperCase()}
            </span>
          </div>

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
              className="text-slate-500 hover:text-blue-600 font-semibold"
            >
              Staff Access
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="container mx-auto px-4 py-12 text-center relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold mb-6">
            <Flame size={16} /> HOT DEALS FOR TECH LEVEL {level} EXPLORERS
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight">
            Upgrade Your <span className="text-blue-600">Digital Life</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Premium devices from the world's best brands. Earn Tech Points with every interaction.
          </p>
          
          {/* Search & Filter Bar */}
          <div className="max-w-4xl mx-auto bg-white p-2 rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text"
                placeholder="Search 40+ models (iPhone, Galaxy, Pixel...)"
                className="w-full pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:bg-slate-50 transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 px-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); addPoints(1); }}
                  className={`px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
                    selectedCategory === cat 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl"></div>
      </header>

      {/* Phone Grid */}
      <main className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredPhones.map(phone => (
            <div 
              key={phone.id}
              onClick={() => { setSelectedPhone(phone); addPoints(5); }}
              className="group bg-white rounded-3xl border border-slate-100 p-5 hover:shadow-2xl hover:shadow-slate-300/50 transition-all cursor-pointer relative"
            >
              {phone.category === 'Flagship' && (
                <div className="absolute top-4 left-4 z-10 bg-amber-400 text-amber-950 text-[10px] font-black px-2 py-1 rounded-md flex items-center gap-1">
                  <Star size={10} fill="currentColor" /> ELITE
                </div>
              )}
              {/* NEW Badge for items added in the last 48 hours */}
              {(phone.isNew || (phone.timestamp && (new Date() - new Date(phone.timestamp) < 48 * 60 * 60 * 1000))) && (
                <div className={`absolute top-4 ${phone.category === 'Flagship' ? 'left-20' : 'left-4'} z-10 bg-blue-600 text-white text-[10px] font-black px-2 py-1 rounded-md flex items-center gap-1 shadow-lg shadow-blue-200`}>
                  <Zap size={10} fill="currentColor" /> NEW
                </div>
              )}
              <div className="aspect-square bg-slate-50 rounded-2xl mb-4 overflow-hidden flex items-center justify-center group-hover:bg-blue-50 transition-colors relative">
                 <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/0 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 {phone.images && phone.images[0] ? (
                   <img src={phone.images[0]} alt={phone.model} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                 ) : (
                   <SmartphoneIcon className="text-slate-400 group-hover:text-blue-500 group-hover:scale-110 transition-all duration-500" size={64} />
                 )}
              </div>
              <div>
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{phone.brand}</span>
                  <div className="flex items-center gap-1">
                    <Star size={12} className="text-amber-400 fill-amber-400" />
                    <span className="text-xs font-bold text-slate-600">{phone.rating}</span>
                  </div>
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-3 group-hover:text-blue-600 transition-colors">{phone.model}</h3>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xl font-black text-slate-900">Ksh {phone.price.toLocaleString()}</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); addToCart(phone); }}
                    className="p-3 bg-slate-100 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPhones.length === 0 && (
          <div className="text-center py-20">
            <Search size={48} className="text-slate-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-800">No phones found</h3>
            <p className="text-slate-500">Try adjusting your search or filters</p>
          </div>
        )}
      </main>

      {/* Phone Details & Order Modal */}
      {selectedPhone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row relative animate-in fade-in slide-in-from-bottom-8 duration-300">
            <button 
              onClick={() => setSelectedPhone(null)}
              className="absolute top-6 right-6 z-10 p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
            >
              <X size={20} />
            </button>

             <div className="md:w-1/2 bg-slate-50 p-8 flex flex-col h-[400px] md:h-auto overflow-hidden">
              <div className="flex-1 flex items-center justify-center">
                 <div className="w-64 h-64 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-8 animate-in zoom-in overflow-hidden">
                   {selectedPhone.images && selectedPhone.images[0] ? (
                     <img src={selectedPhone.images[0]} alt={selectedPhone.model} className="w-full h-full object-cover" />
                   ) : (
                     <SmartphoneIcon size={128} className="text-blue-600" />
                   )}
                 </div>
              </div>
              {/* Image Gallery Thumbnails */}
              {selectedPhone.images && selectedPhone.images.length > 0 && (
                <div className="flex gap-3 justify-center mt-4">
                  {selectedPhone.images.map((img, idx) => (
                    <div key={idx} className="w-16 h-16 bg-white rounded-xl border-2 border-slate-200 hover:border-blue-500 transition-all cursor-pointer flex items-center justify-center shadow-sm overflow-hidden">
                       <img src={img} alt={`${selectedPhone.model} thumbnail ${idx}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2 justify-center mt-6">
                <span className="px-4 py-2 bg-white rounded-full text-[10px] font-black uppercase tracking-wider border border-slate-200 shadow-sm text-slate-500">🚀 Express Delivery</span>
                <span className="px-4 py-2 bg-white rounded-full text-[10px] font-black uppercase tracking-wider border border-slate-200 shadow-sm text-slate-500">🛡️ Certified</span>
              </div>
            </div>

            <div className="md:w-1/2 p-8 md:p-12 overflow-y-auto">
              <div className="mb-8">
                <span className="text-blue-600 font-black text-xs uppercase tracking-widest">{selectedPhone.brand}</span>
                <h2 className="text-4xl font-black text-slate-900 mt-2 leading-tight">{selectedPhone.model}</h2>
                <div className="flex items-center gap-4 mt-6">
                  <div className="text-3xl font-black text-slate-900">Ksh {selectedPhone.price.toLocaleString()}</div>
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">In Stock ({selectedPhone.stock})</div>
                </div>
              </div>

              <div className="space-y-6 mb-10">
                <h4 className="font-black text-slate-800 flex items-center gap-2 text-sm uppercase tracking-widest">
                  <Zap size={18} className="text-blue-600 fill-blue-600" /> Key Specifications
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  {selectedPhone.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 group hover:border-blue-200 transition-all">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-xs group-hover:bg-blue-600 group-hover:text-white transition-all">
                        {i+1}
                      </div>
                      <span className="text-slate-600 font-bold">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => { addToCart(selectedPhone); setShowCart(true); setSelectedPhone(null); }}
                  className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-[0.98]"
                >
                  <ShoppingCart size={24} />
                  Add to Cart & Checkout
                </button>
                <p className="text-center text-xs text-slate-400 font-bold uppercase tracking-widest">
                  Earn +50 Tech points for viewing details
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Custom Error Modal */}
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
