import React from 'react';
import { Shield, Lock, Eye, Trash2, X } from 'lucide-react';

const PrivacyPolicy = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[120] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="max-w-2xl w-full bg-white rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-white/20 animate-in slide-in-from-bottom-8 duration-500">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white/50">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-500 p-3 rounded-2xl shadow-lg shadow-emerald-100">
               <Shield className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 leading-tight">Privacy & Data</h2>
              <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">How we protect your tech life</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 hover:bg-slate-100 rounded-2xl transition-all"
          >
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-600 font-black uppercase text-xs tracking-widest">
              <Eye size={16} /> Data Collection
            </div>
            <p className="text-slate-600 font-medium leading-relaxed">
              We only collect the minimum information required to fulfill your orders and keep you updated on WhatsApp. 
              This includes your name, WhatsApp number, and optionally your email address. 
              We do not track your browsing behavior or sell your data to third parties.
            </p>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2 text-blue-600 font-black uppercase text-xs tracking-widest">
              <Lock size={16} /> Data Security
            </div>
            <p className="text-slate-600 font-medium leading-relaxed">
              Your information is securely transmitted via encrypted n8n webhooks and stored in Google Cloud Infrastructure. 
              Staff access is strictly monitored and requires multi-factor identity verification.
            </p>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2 text-rose-600 font-black uppercase text-xs tracking-widest">
              <Trash2 size={16} /> Your Rights (GDPR)
            </div>
            <p className="text-slate-600 font-medium leading-relaxed">
              Under GDPR and other data regulations, you have the right to:
            </p>
            <ul className="list-disc list-inside text-slate-600 font-medium space-y-2 ml-2">
              <li>Request a copy of your personal data.</li>
              <li>Request correction of any inaccuracies.</li>
              <li>Request deletion of your data ("Right to be Forgotten").</li>
              <li>Withdraw consent for marketing communications at any time.</li>
            </ul>
          </section>

          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
            <p className="text-xs font-bold text-slate-500 text-center">
              To exercise any of these rights, please contact us via WhatsApp or email using the details in the staff portal.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
          <button 
            onClick={() => {
              if (window.confirm("Would you like to send a request to the administrator to view or delete your data? (This will be processed via WhatsApp/Email)")) {
                // In a real app, this would call handleDsarRequest(email/phone)
                alert("Request signal sent! Our team will contact you for verification.");
              }
            }}
            className="flex-1 px-8 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl font-black text-xs hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
          >
            <Shield size={14} /> Request My Data
          </button>
          <button 
            onClick={onClose}
            className="flex-1 px-8 py-3 bg-slate-900 text-white rounded-xl font-black text-sm hover:bg-black transition-all"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
