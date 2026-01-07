import React, { useState } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Zap, 
  Loader2, 
  CheckCircle, 
  AlertCircle 
} from "lucide-react";
import { getWebhookUrl } from "../../utils/config";

/**
 * InventoryManager Component
 * Provides tools for staff to restock items, reduce stock for sales, 
 * and register completely new phone models in the inventory system.
 */
const InventoryManager = ({ n8nConfig }) => {
  const [actionType, setActionType] = useState("add_stock");
  const [formData, setFormData] = useState({
    productId: "",
    model: "",
    brand: "",
    quantity: "",
    price: "",
    minimumStock: "5",
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handles inventory updates by sending data to the n8n webhook
   */
  const handleInventoryAction = async () => {
    // Basic validation based on action type
    if (actionType === "new_product") {
      if (!formData.model || !formData.brand || !formData.quantity || !formData.price) {
        setStatus({ type: "error", message: "Please fill in all fields for new product" });
        return;
      }
    } else {
      if (!formData.productId || !formData.quantity) {
        setStatus({ type: "error", message: "Please select product and enter quantity" });
        return;
      }
    }

    if (!n8nConfig.webhookUrl) {
      setStatus({ type: "error", message: "Please configure n8n webhook URL in Settings" });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const inventoryData = {
        action: "inventory_added",
        source: "staff",
        actionType: actionType,
        timestamp: new Date().toISOString(),
        data: {
          productId: formData.productId || undefined,
          brand: formData.brand || undefined,
          model: formData.model || undefined,
          quantity: parseInt(formData.quantity),
          price: formData.price ? parseFloat(formData.price) : undefined,
          minimumStock: formData.minimumStock ? parseInt(formData.minimumStock) : 5,
        },
        shop: {
          name: n8nConfig.shopName,
          location: n8nConfig.location,
        },
      };

      const finalUrl = getWebhookUrl(n8nConfig.webhookUrl);

      const response = await fetch(finalUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inventoryData),
      });

      if (response.ok) {
        // Safe JSON parsing to avoid "Unexpected end of JSON input"
        const text = await response.text();
        const result = text ? JSON.parse(text) : {};
        let message = "";

        if (actionType === "add_stock") {
          message = `✅ Stock added successfully!\n${result.message || `${formData.quantity} units added.`}`;
        } else if (actionType === "sale") {
          message = `✅ Stock reduced successfully!\n${result.message || `Units reduced by ${formData.quantity}.`}`;
        } else {
          message = `✅ New product added!\n${result.message || `${formData.brand} ${formData.model} registered.`}`;
        }

        if (result.lowStockAlert) {
          message += `\n⚠️ LOW STOCK ALERT: Current level is below minimum!`;
        }

        setStatus({ type: "success", message });
        setFormData({
          productId: "",
          model: "",
          brand: "",
          quantity: "",
          price: "",
          minimumStock: "5",
        });
      } else {
        setStatus({ type: "error", message: "Failed to update inventory. Check your n8n webhook." });
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
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Inventory</h2>
        <p className="text-slate-500 font-medium mt-1">Manage stock levels, update prices, and add new products.</p>
      </div>

      <div className="bg-white/70 backdrop-blur-2xl border border-white/40 p-5 rounded-3xl shadow-xl">
        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4 mb-3 block">Operation Type</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: "add_stock", label: "Restock", icon: TrendingUp, activeColor: "border-emerald-500 bg-emerald-50 text-emerald-700" },
            { id: "sale", label: "Reduce", icon: TrendingDown, activeColor: "border-rose-500 bg-rose-50 text-rose-700" },
            { id: "new_product", label: "New Model", icon: Plus, activeColor: "border-blue-500 bg-blue-50 text-blue-700" },
          ].map((op) => (
            <button
              key={op.id}
              onClick={() => setActionType(op.id)}
              className={`flex items-center justify-center gap-3 px-6 py-4 rounded-2xl border-2 transition-all font-black text-sm ${
                actionType === op.id
                  ? op.activeColor + " shadow-lg"
                  : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200"
              }`}
            >
              <op.icon size={20} />
              {op.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-2xl border border-white/40 p-10 rounded-[2.5rem] shadow-2xl space-y-8">
        {actionType === "new_product" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Brand Name</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full px-6 py-4 bg-white/50 border border-slate-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                placeholder="e.g. Samsung"
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Model Name</label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="w-full px-6 py-4 bg-white/50 border border-slate-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                placeholder="e.g. Galaxy S24"
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Initial Stock</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-6 py-4 bg-white/50 border border-slate-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                placeholder="0"
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Selling Price</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-6 py-4 bg-white/50 border border-slate-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                placeholder="Ksh 0.00"
                disabled={isSubmitting}
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Product ID / SKU</label>
                <input
                  type="text"
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                  className="w-full px-6 py-4 bg-white/50 border border-slate-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                  placeholder="Search product..."
                  disabled={isSubmitting}
                />
             </div>
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Quantity Change</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full px-6 py-4 bg-white/50 border border-slate-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                  placeholder="Enter amount"
                  disabled={isSubmitting}
                />
             </div>
          </div>
        )}

        <div className="space-y-2 pt-4">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Low Stock Alert Threshold</label>
          <input
            type="number"
            value={formData.minimumStock}
            onChange={(e) => setFormData({ ...formData, minimumStock: e.target.value })}
            className="w-full px-6 py-4 bg-white/50 border border-slate-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
            disabled={isSubmitting}
          />
        </div>

        <button
          onClick={handleInventoryAction}
          disabled={isSubmitting}
          className={`w-full py-5 text-white rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 shadow-xl ${
            actionType === 'add_stock' ? 'bg-emerald-600 shadow-emerald-100 hover:bg-emerald-700' :
            actionType === 'sale' ? 'bg-rose-600 shadow-rose-100 hover:bg-rose-700' :
            'bg-blue-600 shadow-blue-100 hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" size={24} />
          ) : (
            <>
              <Zap size={20} className="fill-white" />
              {actionType === 'add_stock' ? 'Confirm Restock' : 
               actionType === 'sale' ? 'Confirm Reduction' : 'Register New Device'}
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

export default InventoryManager;
