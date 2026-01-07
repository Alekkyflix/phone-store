import React, { useState } from "react";
import { 
  Globe, 
  Settings as SettingsIcon, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Zap,
  History,
  RefreshCw,
  ShoppingBag,
  Database
} from "lucide-react";
import { getWebhookUrl } from "../../utils/config";

/**
 * Settings Component
 * Allows staff to configure the shop's identity and automation endpoints.
 * Manages properties like shop name, location, and the critical n8n webhook URL.
 */
const Settings = ({ n8nConfig, saveConfig, history = [], onRefresh, isRefreshing }) => {
  const [activeSubTab, setActiveSubTab] = useState("general"); // 'general' or 'history'
  const [localConfig, setLocalConfig] = useState(n8nConfig);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ type: "", message: "" });

  /**
   * Saves the local configuration back to the parent state and storage
   */
  const handleSaveSettings = async () => {
    setIsSaving(true);
    setSaveStatus({ type: "", message: "" });

    try {
      await saveConfig(localConfig);
      setSaveStatus({
        type: "success",
        message: "✅ Settings committed and synced to cloud!",
      });
    } catch (error) {
      setSaveStatus({ 
        type: "error", 
        message: `🔄 Local save worked, but Cloud Sync failed: ${error.message}. Ensure your n8n workflow handles the 'update_config' action.` 
      });
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Tests the connection to the n8n webhook
   */
  const handleTestConnection = async () => {
    if (!localConfig.webhookUrl) {
      setSaveStatus({ type: "error", message: "❌ Please enter a URL first!" });
      return;
    }

    setIsSaving(true);
    setSaveStatus({ type: "info", message: "📡 Pinging n8n webhook..." });

    try {
      // Use the proxy path in dev to bypass CORS
      const finalUrl = getWebhookUrl(localConfig.webhookUrl);
      
      const response = await fetch(finalUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ping", timestamp: new Date().toISOString() }),
      });

      if (response.ok) {
        setSaveStatus({
          type: "success",
          message: "🚀 Connectivity Verified! n8n responded correctly.",
        });
      } else {
        throw new Error(`n8n responded with ${response.status}`);
      }
    } catch (error) {
      setSaveStatus({ 
        type: "error", 
        message: `🚫 Connection Failed. Please check two things in n8n:\n1. Your Webhook node Method must be 'POST'.\n2. In node 'Settings' -> 'Options', add 'CORS' and set it to '*'.` 
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">System Configuration</h2>
        <p className="text-slate-500 font-medium mt-1">Fine-tune your shop settings and monitor recent activity.</p>
      </div>

      {/* Internal Tab Navigation */}
      <div className="flex gap-4 mb-4 bg-white/50 p-1.5 rounded-2xl border border-slate-200/50 w-fit">
        <button 
          onClick={() => setActiveSubTab("general")}
          className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
            activeSubTab === "general" 
              ? "bg-slate-900 text-white shadow-lg" 
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          General Settings
        </button>
        <button 
          onClick={() => { setActiveSubTab("history"); onRefresh(); }}
          className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${
            activeSubTab === "history" 
              ? "bg-slate-900 text-white shadow-lg" 
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          Transaction History
        </button>
      </div>

      {activeSubTab === "general" ? (
        <div className="bg-white/70 backdrop-blur-2xl border border-white/40 p-10 rounded-[2.5rem] shadow-2xl space-y-8">
        <div className="space-y-4">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">n8n Automation Webhook</label>
          <div className="relative group">
             <Globe className="absolute left-6 top-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input
            type="url"
            value={localConfig.webhookUrl || ""}
            onChange={(e) => setLocalConfig({ ...localConfig, webhookUrl: e.target.value })}
            className={`w-full pl-16 pr-6 py-5 bg-white/50 border rounded-2xl focus:outline-none focus:ring-2 transition-all font-mono text-xs font-bold ${
              localConfig.webhookUrl?.includes('webhook-test') 
                ? 'border-amber-400 focus:ring-amber-500' 
                : 'border-slate-200/50 focus:ring-blue-500'
            }`}
            placeholder="https://your-n8n-instance/webhook/..."
          />
        </div>
        {localConfig.webhookUrl?.includes('webhook-test') && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="text-amber-600 shrink-0" size={20} />
            <div>
              <p className="text-xs font-black text-amber-800 uppercase tracking-tight">Test URL Detected</p>
              <p className="text-[10px] text-amber-700 font-bold mt-1">
                These only work while the n8n editor is open. For a real shop, click the <span className="underline">Production URL</span> tab in n8n and copy that instead.
              </p>
            </div>
          </div>
        )}
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide ml-1">Critical: All sales and inventory data flow through this bridge.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Business Name</label>
            <input
              type="text"
              value={localConfig.shopName}
              onChange={(e) => setLocalConfig({ ...localConfig, shopName: e.target.value })}
              className="w-full px-6 py-4 bg-white/50 border border-slate-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Physical Location</label>
            <input
              type="text"
              value={localConfig.location}
              onChange={(e) => setLocalConfig({ ...localConfig, location: e.target.value })}
              className="w-full px-6 py-4 bg-white/50 border border-slate-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Support Hotline</label>
            <input
              type="tel"
              value={localConfig.inquiryNumber}
              onChange={(e) => setLocalConfig({ ...localConfig, inquiryNumber: e.target.value })}
              className="w-full px-6 py-4 bg-white/50 border border-slate-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Community Link</label>
            <input
              type="url"
              value={localConfig.whatsappGroup}
              onChange={(e) => setLocalConfig({ ...localConfig, whatsappGroup: e.target.value })}
              className="w-full px-6 py-4 bg-white/50 border border-slate-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
              placeholder="WhatsApp Invite URL"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleTestConnection}
            disabled={isSaving}
            className="w-full py-5 bg-white border-2 border-slate-200 text-slate-900 rounded-2xl font-black text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <Zap size={20} className="text-amber-500 fill-amber-500" />
            Test Connectivity
          </button>
          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl shadow-slate-200 hover:bg-black hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 size={24} className="animate-spin" />
            ) : (
              <>
                <SettingsIcon size={20} className="fill-white" />
                Commit System Changes
              </>
            )}
          </button>
        </div>
        </div>
      ) : (
        /* History View */
        <div className="bg-white/70 backdrop-blur-2xl border border-white/40 p-10 rounded-[2.5rem] shadow-2xl">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Recent Activity</h3>
              <p className="text-sm font-bold text-slate-400">Latest 20 entries from Google Sheets</p>
            </div>
            <button 
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm group"
            >
              <RefreshCw size={20} className={`text-slate-600 group-active:rotate-180 transition-transform ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="space-y-4">
            {history.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-3xl">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <History className="text-slate-300" size={32} />
                </div>
                <p className="font-black text-slate-400 uppercase tracking-widest text-sm">No activity records found</p>
                <p className="text-xs text-slate-400 mt-1">Connect your n8n workflow to sync live data.</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-3xl border border-slate-200/50">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200/50">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Detail</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Source</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {history.map((entry, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-5">
                          <p className="font-bold text-slate-700 text-sm">{new Date(entry.timestamp).toLocaleDateString()}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">{new Date(entry.timestamp).toLocaleTimeString()}</p>
                        </td>
                        <td className="px-6 py-5">
                          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg w-fit ${
                            entry.action === 'order_submitted' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {entry.action === 'order_submitted' ? <ShoppingBag size={14} /> : <Database size={14} />}
                            <span className="text-[10px] font-black uppercase tracking-tight">{entry.action === 'order_submitted' ? 'Sale' : 'Inventory'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <p className="font-black text-slate-800 text-sm truncate max-w-[200px]">
                            {entry.action === 'order_submitted' ? (entry.customer?.fullName || entry.customer?.name || 'Order') : (entry.data?.model || entry.actionType)}
                          </p>
                          <p className="text-xs font-bold text-slate-400">
                             {entry.action === 'order_submitted' ? `1 Item • Ksh ${entry.phone?.price?.toLocaleString() || '0'}` : `${entry.data?.quantity || 0} Units • ${entry.actionType}`}
                          </p>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <span className="text-[10px] font-black bg-slate-100 px-3 py-1.5 rounded-full text-slate-500 uppercase tracking-widest">
                            {entry.source || 'system'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {saveStatus.message && (
        <div className={`p-6 rounded-2xl border animate-in slide-in-from-top-4 ${
          saveStatus.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 
          saveStatus.type === 'info' ? 'bg-blue-50 text-blue-700 border-blue-200' :
          'bg-red-50 text-red-700 border-red-200'
        }`}>
          <div className="flex items-start gap-4">
            {saveStatus.type === 'success' ? <CheckCircle size={24} className="text-green-600" /> : <AlertCircle size={24} />}
            <p className="font-bold">{saveStatus.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
