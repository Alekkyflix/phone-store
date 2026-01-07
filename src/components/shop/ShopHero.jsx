import React from 'react';
import { Flame, Search } from 'lucide-react';

/**
 * ShopHero Component
 * 
 * Displays the main promotional header, search bar, and category filters.
 * 
 * @param {Object} props
 * @param {number} props.level - Current user tech level
 * @param {string} props.searchQuery - Current search string
 * @param {Function} props.setSearchQuery - Updates search string
 * @param {string[]} props.categories - List of available categories
 * @param {string} props.selectedCategory - Currently selected category
 * @param {Function} props.setSelectedCategory - Updates selected category
 * @param {Function} props.addPoints - Function to award points on interaction
 */
const ShopHero = ({
  level,
  searchQuery,
  setSearchQuery,
  categories,
  selectedCategory,
  setSelectedCategory,
  addPoints
}) => {
  return (
    <header className="container mx-auto px-4 py-12 text-center relative overflow-hidden">
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold mb-6 animate-pulse-slow">
          <Flame size={16} /> HOT DEALS FOR TECH LEVEL {level} EXPLORERS
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
          Upgrade Your <span className="text-blue-600">Digital Life</span>
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto font-medium">
          Premium devices from the world's best brands. Earn Tech Points with every interaction.
        </p>
        
        {/* Search & Filter Bar */}
        <div className="max-w-4xl mx-auto bg-white p-2 rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row gap-2 transition-all hover:shadow-blue-100/50">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input 
              type="text"
              placeholder="Search 40+ models (iPhone, Galaxy, Pixel...)"
              className="w-full pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:bg-slate-50 transition-all font-bold text-slate-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 px-2 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => { setSelectedCategory(cat); addPoints(1); }}
                className={`px-6 py-3 rounded-xl font-black transition-all whitespace-nowrap ${
                  selectedCategory === cat 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 scale-105' 
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-50 rounded-full blur-3xl opacity-50 -z-10 animate-pulse-slow" />
    </header>
  );
};

export default ShopHero;
