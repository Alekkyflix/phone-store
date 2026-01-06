import React, { useState } from "react";
import { 
  Search, 
  Loader2 
} from "lucide-react";

/**
 * CustomersList Component
 * Provides a searchable interface for the customer database.
 * Connects to n8n to retrieve sales history and contact information.
 */
const CustomersList = ({ n8nConfig }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchStatus, setSearchStatus] = useState({ type: "", message: "" });

  /**
   * Triggers a customer search request to n8n
   */
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchStatus({
        type: "error",
        message: "Please enter a search term",
      });
      return;
    }

    if (!n8nConfig.webhookUrl) {
      setSearchStatus({
        type: "error",
        message: "Please configure n8n webhook URL in Settings",
      });
      return;
    }

    setIsSearching(true);
    setSearchStatus({ type: "", message: "" });
    setSearchResults([]);

    try {
      const searchData = {
        action: "search_customer",
        timestamp: new Date().toISOString(),
        search: {
          query: searchQuery,
          type: searchType,
        },
      };

      const response = await fetch(n8nConfig.webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(searchData),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.customers && result.customers.length > 0) {
          setSearchResults(result.customers);
          setSearchStatus({
            type: "success",
            message: `Found ${result.customers.length} customer(s)`,
          });
        } else {
          setSearchStatus({
            type: "info",
            message: "No customers found matching your search",
          });
        }
      } else {
        setSearchStatus({
          type: "error",
          message: "Search failed. Please check your n8n webhook configuration.",
        });
      }
    } catch (error) {
      setSearchStatus({ type: "error", message: `Error: ${error.message}` });
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Customer Database</h2>
        <p className="text-slate-500 font-medium mt-1">Search through your sales history and customer contact details.</p>
      </div>

      <div className="bg-white/70 backdrop-blur-2xl border border-white/40 p-10 rounded-[2.5rem] shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="px-6 py-4 bg-white/50 border border-slate-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold appearance-none min-w-[180px]"
            disabled={isSearching}
          >
            <option value="name">Customer Name</option>
            <option value="phone">Phone Number</option>
            <option value="model">Phone Model</option>
            <option value="nationalId">National ID</option>
            <option value="date">Purchase Date</option>
          </select>

          <div className="flex-1 relative group">
             <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Search by ${searchType}...`}
              className="w-full px-6 py-4 bg-white/50 border border-slate-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
              disabled={isSearching}
            />
            <Search className="absolute right-6 top-4 text-slate-300 group-focus-within:text-blue-500" size={20} />
          </div>

          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 disabled:opacity-50"
          >
            {isSearching ? <Loader2 size={24} className="animate-spin" /> : "Verify"}
          </button>
        </div>

        {searchStatus.message && (
          <div className={`p-4 rounded-xl text-sm font-bold ${searchStatus.type === 'success' ? 'bg-green-500/10 text-green-700' : 'bg-blue-500/10 text-blue-700'}`}>
            {searchStatus.message}
          </div>
        )}
      </div>

      {searchResults.length > 0 && (
        <div className="bg-white/70 backdrop-blur-2xl border border-white/40 rounded-[2.5rem] shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Customer</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Contact</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Device</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Amount</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {searchResults.map((customer, idx) => (
                  <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-8 py-6">
                      <p className="font-black text-slate-800">{customer.customerName || "Anonymous"}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{customer.nationalId || "No ID"}</p>
                    </td>
                    <td className="px-8 py-6 font-bold text-slate-600">{customer.phoneNumber}</td>
                    <td className="px-8 py-6 font-bold text-slate-600">{customer.phoneBought}</td>
                    <td className="px-8 py-6 font-black text-blue-600">Ksh {customer.amount?.toLocaleString()}</td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase tracking-tighter">Verified</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersList;
