import React, { useState } from "react";
import { 
  Plus, 
  X, 
  Loader2, 
  Megaphone, 
  CheckCircle, 
  AlertCircle 
} from "lucide-react";

/**
 * OfferBroadcast Component
 * Enables staff to create and launch multi-channel promotional offers.
 * Includes image upload previews and automated AI messaging triggers via n8n.
 */
const OfferBroadcast = ({ n8nConfig }) => {
  const [offerData, setOfferData] = useState({
    phoneModel: "",
    price: "",
    features: "",
    dealType: "new-arrival",
    images: [],
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Processes multiple image uploads into Base64 for transit
   */
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imagePromises = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            name: file.name,
            data: reader.result,
            type: file.type,
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then((images) => {
      setOfferData({
        ...offerData,
        images: [...offerData.images, ...images],
      });
    });
  };

  const removeImage = (index) => {
    const newImages = offerData.images.filter((_, i) => i !== index);
    setOfferData({ ...offerData, images: newImages });
  };

  /**
   * Submits the broadcast request to n8n
   */
  const handleSendOffer = async () => {
    if (!offerData.phoneModel || !offerData.price) {
      setStatus({
        type: "error",
        message: "Please enter phone model and price",
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
      const broadcastData = {
        action: "broadcast_offer",
        timestamp: new Date().toISOString(),
        offer: {
          ...offerData,
          price: parseFloat(offerData.price),
        },
        shop: {
          name: n8nConfig.shopName,
          location: n8nConfig.location,
          inquiryNumber: n8nConfig.inquiryNumber,
        },
      };

      const response = await fetch(n8nConfig.webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(broadcastData),
      });

      if (response.ok) {
        const result = await response.json();
        setStatus({
          type: "success",
          message: `✅ Offer broadcast initiated!\n${
            result.message ||
            "AI-generated message will be sent to WhatsApp group shortly."
          }`,
        });
        setOfferData({
          phoneModel: "",
          price: "",
          features: "",
          dealType: "new-arrival",
          images: [],
        });
      } else {
        setStatus({
          type: "error",
          message: "Failed to send offer. Please check your n8n webhook.",
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
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Broadcast Deals</h2>
        <p className="text-slate-500 font-medium mt-1">Create and send high-converting promotional offers to your customers.</p>
      </div>

      <div className="bg-white/70 backdrop-blur-2xl border border-white/40 p-10 rounded-[2.5rem] shadow-2xl space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Featured Device</label>
            <input
              type="text"
              value={offerData.phoneModel}
              onChange={(e) => setOfferData({ ...offerData, phoneModel: e.target.value })}
              className="w-full px-6 py-4 bg-white/50 border border-slate-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
              placeholder="e.g. iPhone 15 Pro Max"
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Special Price</label>
            <input
              type="number"
              value={offerData.price}
              onChange={(e) => setOfferData({ ...offerData, price: e.target.value })}
              className="w-full px-6 py-4 bg-white/50 border border-slate-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
              placeholder="Ksh 0.00"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Offer Category</label>
          <div className="flex flex-wrap gap-3">
            {[
              { id: 'new-arrival', label: '🆕 New Arrival' },
              { id: 'discount', label: '💰 Special Discount' },
              { id: 'featured', label: '⭐ Featured Deal' },
              { id: 'flash-sale', label: '⚡ Flash Sale' },
            ].map((deal) => (
              <button
                key={deal.id}
                onClick={() => setOfferData({ ...offerData, dealType: deal.id })}
                className={`px-5 py-3 rounded-xl font-bold text-sm transition-all border-2 ${
                  offerData.dealType === deal.id
                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100'
                    : 'bg-white/50 border-slate-100 text-slate-400 hover:border-slate-200'
                }`}
              >
                {deal.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Highlight Features</label>
          <textarea
            value={offerData.features}
            onChange={(e) => setOfferData({ ...offerData, features: e.target.value })}
            className="w-full px-6 py-4 bg-white/50 border border-slate-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold min-h-[120px]"
            placeholder="e.g. 256GB Storage, 120Hz Display..."
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-4">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Image Gallery</label>
          <div className="flex flex-wrap gap-4 items-center">
             <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-slate-200 rounded-3xl cursor-pointer hover:bg-white/50 transition-all group">
                <Plus className="text-slate-300 group-hover:text-blue-500 transition-colors" size={32} />
                <input type="file" className="hidden" multiple accept="image/*" onChange={handleImageUpload} disabled={isSubmitting} />
             </label>
             {offerData.images.map((img, idx) => (
               <div key={idx} className="relative w-32 h-32 rounded-3xl overflow-hidden border border-slate-200 shadow-sm animate-in zoom-in duration-300">
                  <img src={img.data} className="w-full h-full object-cover" alt="Preview" />
                  <button onClick={() => removeImage(idx)} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg">
                    <X size={14} />
                  </button>
               </div>
             ))}
          </div>
        </div>

        <button
          onClick={handleSendOffer}
          disabled={isSubmitting}
          className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 size={24} className="animate-spin" />
          ) : (
            <>
              <Megaphone size={20} className="fill-white" />
              Launch Multi-Channel Broadcast
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

export default OfferBroadcast;
