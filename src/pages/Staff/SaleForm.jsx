import React, { useState } from "react";
import { 
  Zap, 
  Loader2, 
  CheckCircle, 
  AlertCircle 
} from "lucide-react";
import { getWebhookUrl } from "../../utils/config";

/**
 * SaleForm Component
 * 
 * Allows staff to record new sales and trigger customer notifications via n8n.
 * 
 * @param {Object} props
 * @param {Object} props.n8nConfig - System configuration (shop name, whatsapp details, etc.)
 */
const SaleForm = ({ n8nConfig }) => {
  const [formData, setFormData] = useState({
    customerName: "",
    phoneNumber: "",
    phoneBought: "",
    amount: "",
    paymentMode: "cash",
    salesPerson: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Submits the sale data to the configured n8n webhook
   */
  const handleSubmit = async () => {
    if (
      !formData.customerName ||
      !formData.phoneNumber ||
      !formData.phoneBought ||
      !formData.amount ||
      !formData.salesPerson
    ) {
      setStatus({
        type: "error",
        message: "Please fill in all required fields",
      });
      return;
    }

    if (!formData.phoneNumber.startsWith('+')) {
      setStatus({
        type: "error",
        message: "Phone number must start with country code (e.g., +254)",
      });
      return;
    }

    if (!n8nConfig.webhookUrl) {
      setStatus({
        type: "error",
        message: "Please configure n8n webhook URL in Settings",
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const saleData = {
        action: "order_submitted",
        source: "staff",
        timestamp: new Date().toISOString(),
        sale: {
          ...formData,
          amount: parseFloat(formData.amount),
        },
        shop: {
          name: n8nConfig.shopName,
          location: n8nConfig.location,
          inquiryNumber: n8nConfig.inquiryNumber,
          whatsappGroup: n8nConfig.whatsappGroup,
        },
      };

      const finalUrl = getWebhookUrl(n8nConfig.webhookUrl);
      
      const response = await fetch(finalUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(saleData),
      });

      if (response.ok) {
        const result = await response.json();
        setStatus({
          type: "success",
          message: `✅ Sale recorded! ${
            result.receiptNumber ? `Receipt #${result.receiptNumber}` : ""
          }\n${
            result.message ||
            "Customer will receive WhatsApp message shortly.\nInventory automatically updated!"
          }`,
        });
        setFormData({
          customerName: "",
          phoneNumber: "",
          phoneBought: "",
          amount: "",
          paymentMode: "cash",
          salesPerson: "",
        });
      } else {
        setStatus({
          type: "error",
          message: "Failed to record sale. Please check your n8n webhook.",
        });
      }
    } catch (error) {
      setStatus({ type: "error", message: `Error: ${error.message}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Record New Sale</h2>
        <p className="text-slate-500 font-medium mt-1">Complete the form to track transactions and notify customers.</p>
      </div>

      <div className="bg-white/70 backdrop-blur-2xl border border-white/40 p-10 rounded-[2.5rem] shadow-2xl space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Customer Information</label>
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              className="w-full px-6 py-4 bg-white/50 border border-slate-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
              placeholder="Full Name"
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">WhatsApp Number</label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              className="w-full px-6 py-4 bg-white/50 border border-slate-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
              placeholder="+254..."
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Phone Model Sold</label>
              <input
                type="text"
                value={formData.phoneBought}
                onChange={(e) => setFormData({ ...formData, phoneBought: e.target.value })}
                className="w-full px-6 py-4 bg-white/50 border border-slate-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                placeholder="e.g. iPhone 15 Pro"
                disabled={isSubmitting}
              />
           </div>
           <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Amount (Ksh)</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-6 py-4 bg-white/50 border border-slate-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                placeholder="0.00"
                disabled={isSubmitting}
              />
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Payment Method</label>
              <select
                value={formData.paymentMode}
                onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                className="w-full px-6 py-4 bg-white/50 border border-slate-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold appearance-none"
                disabled={isSubmitting}
              >
                <option value="cash">Cash</option>
                <option value="mpesa">M-Pesa</option>
                <option value="bank">Bank Transfer</option>
                <option value="installment">Installment</option>
              </select>
           </div>
           <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Staff Member</label>
              <input
                type="text"
                value={formData.salesPerson}
                onChange={(e) => setFormData({ ...formData, salesPerson: e.target.value })}
                className="w-full px-6 py-4 bg-white/50 border border-slate-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                placeholder="Sales Representative Name"
                disabled={isSubmitting}
              />
           </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 size={24} className="animate-spin" />
          ) : (
            <>
              <Zap size={20} className="fill-white" />
              Record & Send Verification
            </>
          )}
        </button>
      </div>

      {status.message && (
        <div className={`p-6 rounded-2xl animate-in slide-in-from-top-4 ${status.type === 'success' ? 'bg-green-500/10 text-green-700 border border-green-200' : 'bg-red-500/10 text-red-700 border border-red-200'}`}>
          <div className="flex items-start gap-4">
            {status.type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
            <p className="font-bold whitespace-pre-wrap">{status.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SaleForm;
