import React, { useState, useEffect } from "react";
import {
  Users,
  Package,
  MessageSquare,
  ShoppingCart,
  LogOut,
  Settings as SettingsIcon,
} from "lucide-react";

// Utility Imports
import { DEFAULT_CONFIG, getWebhookUrl } from "./utils/config";
import { hashPassword } from "./utils/crypto";

// Component Imports
import SmartphoneIcon from "./components/common/SmartphoneIcon";
import LandingPage from "./pages/LandingPage/LandingPage";
import AuthPage from "./pages/Auth/AuthPage";
import SaleForm from "./pages/Staff/SaleForm";
import InventoryManager from "./pages/Staff/InventoryManager";
import OfferBroadcast from "./pages/Staff/OfferBroadcast";
import CustomersList from "./pages/Staff/CustomersList";
import Settings from "./pages/Staff/Settings";

/**
 * PhoneShopManager - Main Application Orchestrator
 * 
 * This is the root component of the application. It manages global state,
 * including authentication, gamification, shopping cart, and system configuration.
 * It serves as a router to switch between the customer LandingPage, the AuthPage,
 * and the internal Staff Dashboard.
 */
const PhoneShopManager = () => {
  // Navigation & View State
  const [currentView, setCurrentView] = useState("landing"); // 'landing', 'login', 'signup', 'app'
  const [activeTab, setActiveTab] = useState("sale"); // Staff dashboard tabs
  
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  // System Configuration
  const [n8nConfig, setN8nConfig] = useState(DEFAULT_CONFIG);

  // Gamification & Rewards State
  const [techPoints, setTechPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [badges, setBadges] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);

  // Shopping Cart State
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);

  // Live Data State
  const [inventory, setInventory] = useState([]);
  const [history, setHistory] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ===== INITIALIZATION LOGIC =====

  useEffect(() => {
    const initializeApp = async () => {
      await loadConfig();
      await loadGamification();
      await checkAuthStatus();
      await fetchInventory(); // Initial inventory load
    };
    initializeApp();
  }, []);

  /**
   * Loads system configuration.
   * Logic: 1. Try local storage (fast) 2. Try cloud n8n (synced)
   */
  const loadConfig = async () => {
    try {
      // Step 1: Instant load from browser memory
      const localStored = localStorage.getItem("n8n-config") || 
                         (window.storage ? (await window.storage.get("n8n-config"))?.value : null);
      
      if (localStored) {
        setN8nConfig(JSON.parse(localStored));
      }

      // Step 2: Cloud sync (if we have a URL)
      const currentUrl = localStored ? JSON.parse(localStored).webhookUrl : DEFAULT_CONFIG.webhookUrl;
      
      if (currentUrl) {
        const finalUrl = getWebhookUrl(currentUrl);
        const response = await fetch(finalUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "get_config", timestamp: new Date().toISOString() }),
        });

        if (response.ok) {
          const cloudConfig = await response.json();
          // We expect { success: true, config: { ... } }
          if (cloudConfig && cloudConfig.success && cloudConfig.config) {
            setN8nConfig(cloudConfig.config);
            localStorage.setItem("n8n-config", JSON.stringify(cloudConfig.config));
          }
        }
      }
    } catch (error) {
      console.warn("Settings sync: using local defaults (Cloud unreachable)");
    }
  };

  /**
   * Fetches the latest inventory from n8n/Google Sheets.
   * Updates the global inventory state used by both LandingPage and Staff Hub.
   */
  const fetchInventory = async () => {
    try {
      const finalUrl = getWebhookUrl(n8nConfig.webhookUrl);
      if (!finalUrl) return;

      const response = await fetch(finalUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get_inventory", timestamp: new Date().toISOString() }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.success && data.inventory) {
          setInventory(data.inventory);
        }
      }
    } catch (error) {
      // Silently fail to fallback to mock data
    }
  };

  /**
   * Fetches recent transaction history for the Staff History tab.
   * Provides transparency into sales and inventory movements.
   */
  const fetchHistory = async () => {
    try {
      setIsRefreshing(true);
      const finalUrl = getWebhookUrl(n8nConfig.webhookUrl);
      if (!finalUrl) return;

      const response = await fetch(finalUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get_history", timestamp: new Date().toISOString() }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.success && data.history) {
          setHistory(data.history);
        }
      }
    } catch (error) {
      // Fail gracefully
    } finally {
      setIsRefreshing(false);
    }
  };

  /**
   * Saves configuration to both browser and cloud
   */
  const saveConfig = async (config) => {
    // 1. Instant local persistence
    setN8nConfig(config);
    localStorage.setItem("n8n-config", JSON.stringify(config));
    if (window.storage) {
      await window.storage.set("n8n-config", JSON.stringify(config));
    }

    // 2. Cloud persistence
    if (config.webhookUrl) {
      try {
        const finalUrl = getWebhookUrl(config.webhookUrl);
        const response = await fetch(finalUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            action: "update_config", 
            config,
            timestamp: new Date().toISOString() 
          }),
        });
        
        if (!response.ok) throw new Error("Cloud rejected the save request");
      } catch (error) {
        console.error("Cloud Save Error:", error);
        throw error;
      }
    }
  };

  /**
   * Checks if a valid staff session exists in storage
   */
  const checkAuthStatus = async () => {
    try {
      // Check both specialized storage and standard localStorage for robustness
      const storedAuth = localStorage.getItem('phone-shop-auth') || 
                        (window.storage ? (await window.storage.get("phone-shop-auth"))?.value : null);
      
      if (storedAuth) {
        const auth = JSON.parse(storedAuth);
        // Sessions expire after 24 hours
        const isExpired = new Date() - new Date(auth.timestamp) > 24 * 60 * 60 * 1000;
        
        if (!isExpired && auth.isAuthenticated) {
          setIsAuthenticated(true);
          setCurrentUser(auth.user);
          setCurrentView("app");
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    }
  };

  /**
   * Loads user's earned points and level from storage
   */
  const loadGamification = async () => {
    try {
      const savedPoints = localStorage.getItem("techPoints");
      const savedLevel = localStorage.getItem("techLevel");
      const savedBadges = localStorage.getItem("techBadges");

      if (savedPoints) setTechPoints(parseInt(savedPoints));
      if (savedLevel) setLevel(parseInt(savedLevel));
      if (savedBadges) setBadges(JSON.parse(savedBadges));
    } catch (error) {
      console.warn("Failed to load gamification data");
    }
  };

  /**
   * Core points logic. Handles level-ups and achievement unlocking.
   */
  const addPoints = (amount, badgeName = null) => {
    const newPoints = techPoints + amount;
    setTechPoints(newPoints);
    localStorage.setItem("techPoints", newPoints.toString());

    // Achievement logic
    if (badgeName && !badges.includes(badgeName)) {
      const newBadges = [...badges, badgeName];
      setBadges(newBadges);
      localStorage.setItem("techBadges", JSON.stringify(newBadges));
    }

    // Level up logic (Level increments every 500 points)
    const newLevel = Math.floor(newPoints / 500) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
      localStorage.setItem("techLevel", newLevel.toString());
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  };

  // ===== CART LOGIC =====

  const addToCart = (phone) => {
    setCartItems([...cartItems, phone]);
    addPoints(10); // Reward for shopping intent
  };

  const removeFromCart = (index) => {
    const newCart = cartItems.filter((_, i) => i !== index);
    setCartItems(newCart);
  };

  const clearCart = () => setCartItems([]);

  // ===== AUTHENTICATION LOGIC =====

  const logout = async () => {
    localStorage.removeItem('phone-shop-auth');
    if (window.storage) await window.storage.delete("phone-shop-auth");
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentView("landing");
  };

  // ===== MAIN RENDER ORCHESTRATION =====

  return (
    <>
      {/* Customer View */}
      {currentView === "landing" && (
        <LandingPage 
          n8nConfig={n8nConfig}
          techPoints={techPoints}
          level={level}
          addPoints={addPoints}
          cartItems={cartItems}
          cartCount={cartItems.length}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          clearCart={clearCart}
          setCurrentView={setCurrentView}
          showConfetti={showConfetti}
          showCart={showCart}
          setShowCart={setShowCart}
          liveInventory={inventory}
          onRefresh={fetchInventory}
          isRefreshing={isRefreshing}
        />
      )}

      {/* Security Views */}
      {currentView === "login" && (
        <AuthPage 
          mode="login" 
          n8nConfig={n8nConfig}
          setCurrentUser={setCurrentUser}
          setIsAuthenticated={setIsAuthenticated}
          setCurrentView={setCurrentView}
        />
      )}
      {currentView === "signup" && (
        <AuthPage 
          mode="signup"
          n8nConfig={n8nConfig}
          setCurrentUser={setCurrentUser}
          setIsAuthenticated={setIsAuthenticated}
          setCurrentView={setCurrentView}
        />
      )}

      {/* Staff Dashboard (Authenticated) */}
      {isAuthenticated && currentView === "app" && (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row relative overflow-hidden">
          {/* Dashboard Abstract Background */}
          <div className="fixed inset-0 pointer-events-none z-0">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/30 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-100/30 rounded-full blur-[120px]"></div>
          </div>

          {/* Persistent Sidebar Navigation */}
          <div className="w-full md:w-72 bg-white/80 backdrop-blur-xl border-r border-slate-200/50 flex flex-col z-20 shadow-2xl relative">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-10">
                <div className="bg-blue-600 p-2.5 rounded-2xl shadow-xl shadow-blue-200">
                  <SmartphoneIcon className="text-white" size={24} />
                </div>
                <span className="text-xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  STAFF HUB
                </span>
              </div>

              <nav className="space-y-1">
                {[
                  { id: "sale", label: "Make Sale", icon: ShoppingCart },
                  { id: "inventory", label: "Inventory", icon: Package },
                  { id: "offers", label: "Broadcast", icon: MessageSquare },
                  { id: "customers", label: "Customers", icon: Users },
                  { id: "settings", label: "Settings", icon: SettingsIcon },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-sm transition-all group ${
                      activeTab === item.id
                        ? "bg-blue-600 text-white shadow-xl shadow-blue-200"
                        : "text-slate-500 hover:bg-slate-100/80 hover:text-slate-900"
                    }`}
                  >
                    <item.icon
                      size={20}
                      className={activeTab === item.id ? "text-white" : "text-slate-400 group-hover:text-blue-600"}
                    />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Staff Session Info & Sign Out */}
            <div className="mt-auto p-8 border-t border-slate-200/50">
              <div className="bg-slate-50/50 p-4 rounded-2xl mb-4 border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 text-center">Identity Verified</p>
                <p className="font-bold text-slate-800 text-sm truncate text-center">{currentUser?.fullName}</p>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-sm text-red-500 hover:bg-red-50 transition-all group"
              >
                <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                Sign Out
              </button>
            </div>
          </div>

          {/* Dynamic Content Switching Layer */}
          <div className="flex-1 overflow-y-auto z-10 p-8 md:p-12 relative h-screen custom-scrollbar">
            <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              {activeTab === "sale" && <SaleForm n8nConfig={n8nConfig} />}
              {activeTab === "inventory" && (
                <InventoryManager 
                  n8nConfig={n8nConfig} 
                  onRefresh={fetchInventory}
                  isRefreshing={isRefreshing}
                />
              )}
              {activeTab === "offers" && <OfferBroadcast n8nConfig={n8nConfig} />}
              {activeTab === "customers" && <CustomersList n8nConfig={n8nConfig} />}
              {activeTab === "settings" && (
                <Settings 
                  n8nConfig={n8nConfig} 
                  saveConfig={saveConfig} 
                  isRefreshing={isRefreshing}
                  onRefresh={fetchHistory}
                  history={history}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PhoneShopManager;
