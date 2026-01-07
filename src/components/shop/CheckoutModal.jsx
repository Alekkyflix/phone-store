import React from 'react';
import { ShoppingCart, X, Trash2, Zap, User, Phone, Mail, Smartphone, CreditCard, Banknote, Loader2 } from 'lucide-react';

/**
 * CheckoutModal Component
 * 
 * A comprehensive modal that handles both the cart review and the final checkout form.
 * Features glassmorphism styling and interactive payment method selection.
 * 
 * @param {Object} props
 * @param {boolean} props.showCart - Whether the modal is visible
 * @param {Function} props.setShowCart - Toggles modal visibility
 * @param {Object[]} props.cartItems - Items currently in the cart
 * @param {Function} props.removeFromCart - Removes a specific item from the cart
 * @param {Function} props.clearCart - Empties the entire cart
 * @param {Function} props.handleOrderSubmit - Processes the final form submission
 * @param {string} props.orderStatus - Current status of the order (idle, ordering, success)
 * @param {string} props.paymentMethod - Currently selected payment method
 * @param {Function} props.setPaymentMethod - Updates the payment method
 */
const CheckoutModal = ({
  showCart,
  setShowCart,
  cartItems,
  removeFromCart,
  clearCart,
  handleOrderSubmit,
  orderStatus,
  paymentMethod,
  setPaymentMethod
}) => {
  if (!showCart) return null;

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="h-full w-full max-w-2xl bg-white/90 backdrop-blur-xl shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden border-l border-white/20">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white/50">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-100">
               <ShoppingCart className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 leading-tight">Your Tech Cart</h2>
              <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">{cartItems.length} items ready for checkout</p>
            </div>
          </div>
          <button 
            onClick={() => setShowCart(false)}
            className="p-3 hover:bg-slate-100 rounded-2xl transition-all hover:rotate-90"
            aria-label="Close"
          >
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {orderStatus === 'success' ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center border-8 border-white shadow-2xl">
                <Zap size={48} className="text-green-500 fill-green-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-black text-slate-900">Order Initiated! 🚀</h3>
                <p className="text-slate-500 font-medium max-w-xs mx-auto">
                  We've received your request. Our team will contact you on WhatsApp shortly for verification.
                </p>
              </div>
              <button 
                onClick={() => { setShowCart(false); clearCart(); }}
                className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-black transition-all shadow-xl"
              >
                Back to Shop
              </button>
            </div>
          ) : (
            <div className="space-y-10">
              {/* Order Summary Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Order Summary</h4>
                  {cartItems.length > 0 && (
                    <button onClick={clearCart} className="text-[10px] font-black text-red-500 uppercase tracking-tighter hover:underline">Clear All</button>
                  )}
                </div>
                
                <div className="space-y-3">
                  {cartItems.length === 0 ? (
                    <div className="py-12 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                      <p className="text-slate-400 font-bold">Your cart is feeling light...</p>
                    </div>
                  ) : (
                    cartItems.map((item, idx) => (
                      <div key={`cart-${idx}`} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm animate-in slide-in-from-right duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
                        <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center shrink-0">
                          <Smartphone className="text-blue-600" size={24} />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-black text-slate-900">{item.model}</h5>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{item.brand}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-slate-900">Ksh {item.price.toLocaleString()}</p>
                          <button 
                            onClick={() => removeFromCart(idx)}
                            className="text-red-400 hover:text-red-600 transition-colors p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {cartItems.length > 0 && (
                <div className="space-y-8 pb-10">
                   <div className="h-px bg-slate-100" />
                   
                   {orderStatus === 'ordering' ? (
                     <div className="bg-blue-600/10 p-10 rounded-[2.5rem] flex flex-col items-center gap-4 animate-pulse">
                        <Loader2 size={40} className="animate-spin text-blue-600" />
                        <span className="font-black text-blue-700 tracking-tight">Verifying details...</span>
                     </div>
                   ) : (
                     <form onSubmit={(e) => {
                       e.preventDefault();
                       const formData = new FormData(e.target);
                       handleOrderSubmit(Object.fromEntries(formData));
                     }} className="space-y-8">
                       
                       {/* Customer Details */}
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="space-y-2">
                             <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                             <div className="relative group">
                                <User className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                                <input name="name" required placeholder="John Doe" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all font-bold" />
                             </div>
                          </div>
                          <div className="space-y-2">
                             <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">WhatsApp (+254...)</label>
                             <div className="relative group">
                                <Phone className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                                <input name="customerPhone" required placeholder="+2547XXXXXXXX" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all font-bold" />
                             </div>
                          </div>
                       </div>

                       <div className="space-y-2">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                          <div className="relative group">
                             <Mail className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                             <input name="email" type="email" required placeholder="john@example.com" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all font-bold" />
                          </div>
                       </div>

                       {/* Payment Method chips */}
                       <div className="space-y-4">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Select Payment Method</label>
                          <div className="grid grid-cols-3 gap-3">
                             {[
                               { id: 'mpesa', label: 'M-PESA', icon: Smartphone, sub: 'Instant' },
                               { id: 'card', label: 'CARD', icon: CreditCard, sub: 'Soon', disabled: true },
                               { id: 'cash', label: 'CASH', icon: Banknote, sub: 'Pickup' }
                             ].map((opt) => (
                               <button
                                 key={opt.id}
                                 type="button"
                                 disabled={opt.disabled}
                                 onClick={() => setPaymentMethod(opt.id)}
                                 className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all relative ${
                                   opt.disabled ? 'opacity-50 grayscale cursor-not-allowed' :
                                   paymentMethod === opt.id ? 'border-blue-600 bg-blue-50' : 'border-slate-100 hover:border-slate-200'
                                 }`}
                               >
                                 {opt.disabled && <span className="absolute top-1 right-1 px-1.5 py-0.5 bg-slate-900 text-[6px] text-white font-black rounded uppercase">Soon</span>}
                                 <opt.icon size={20} className={paymentMethod === opt.id ? 'text-blue-600' : 'text-slate-400'} />
                                 <div className="text-center">
                                    <p className={`text-[10px] font-black ${paymentMethod === opt.id ? 'text-blue-900' : 'text-slate-400'}`}>{opt.label}</p>
                                    <p className="text-[8px] font-bold text-slate-300 uppercase tracking-tighter">{opt.sub}</p>
                                 </div>
                               </button>
                             ))}
                          </div>
                          <input type="hidden" name="paymentMethod" value={paymentMethod} />
                       </div>

                       <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <input type="checkbox" name="subscribeToOffers" id="sub" defaultChecked className="w-4 h-4 rounded text-blue-600" />
                          <label htmlFor="sub" className="text-[10px] font-bold text-slate-500 leading-tight">I want to receive tech updates and exclusive member-only offers.</label>
                       </div>

                       <div className="space-y-4 pt-4">
                          <div className="bg-slate-900 text-white p-6 rounded-3xl flex justify-between items-center shadow-2xl shadow-slate-300">
                             <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Pay-Value</p>
                                <p className="text-3xl font-black">Ksh {total.toLocaleString()}</p>
                             </div>
                             <button type="submit" className="bg-blue-600 px-8 py-4 rounded-2xl font-black hover:bg-blue-700 transition-all flex items-center gap-2 group">
                                <Zap size={20} className="fill-white group-hover:animate-pulse" /> Confirm
                             </button>
                          </div>
                          <p className="text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Securely Encrypted Checkout</p>
                       </div>
                     </form>
                   )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
