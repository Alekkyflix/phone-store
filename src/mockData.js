export const MOCK_PHONES = [
  // FLAGSHIP
  { id: 1, brand: 'Apple', model: 'iPhone 15 Pro Max', price: 159900, category: 'Flagship', stock: 12, rating: 4.9, images: ['images/iphone-15-pro-max.png'], features: ['Titanium design', 'A17 Pro chip', '48MP Main camera', 'USB-C'] },
  { id: 2, brand: 'Samsung', model: 'Galaxy S24 Ultra', price: 145000, category: 'Flagship', stock: 8, rating: 4.8, images: ['images/galaxy-s24-ultra.png'], features: ['Galaxy AI', '200MP Camera', 'Snapdragon 8 Gen 3', 'S Pen included'] },
  { id: 3, brand: 'Google', model: 'Pixel 8 Pro', price: 115000, category: 'Flagship', stock: 15, rating: 4.7, images: ['images/pixel-8-pro.png'], features: ['Tensor G3', 'Best AI Photos', '7 years of updates', 'Super Actua display'] },
  { id: 4, brand: 'Xiaomi', model: '14 Ultra', price: 130000, category: 'Flagship', stock: 5, rating: 4.6, images: ['images/xiaomi-14-ultra.png'], features: ['Leica Optics', 'Snapdragon 8 Gen 3', '90W Fast charging', '1-inch sensor'] },
  { id: 5, brand: 'OnePlus', model: '12', price: 95000, category: 'Flagship', stock: 20, rating: 4.7, images: ['images/midrange-phone.png'], features: ['Hasselblad Camera', 'Snapdragon 8 Gen 3', '5400mAh battery', '100W Charging'] },
  { id: 6, brand: 'Apple', model: 'iPhone 15', price: 110000, category: 'Flagship', stock: 25, rating: 4.8, images: ['images/iphone-15-pro-max.png'], features: ['Dynamic Island', 'A16 Bionic', '48MP Main camera', 'USB-C'] },
  { id: 7, brand: 'Samsung', model: 'Galaxy Z Fold 5', price: 185000, category: 'Flagship', stock: 4, rating: 4.5, images: ['images/galaxy-s24-ultra.png'], features: ['Large screen', 'Slimmer hinge', 'Taskbar-style navigation', 'S Pen support'] },
  { id: 8, brand: 'Sony', model: 'Xperia 1 V', price: 135000, category: 'Flagship', stock: 6, rating: 4.4, images: ['images/midrange-phone.png'], features: ['4K HDR OLED', 'Pro photography', 'Hi-Res Audio', '5000mAh battery'] },
  { id: 9, brand: 'Asus', model: 'ROG Phone 8 Pro', price: 125000, category: 'Flagship', stock: 10, rating: 4.9, images: ['images/gaming-phone.png'], features: ['Gaming beast', '165Hz Display', 'AirTriggers', 'AniMe Vision'] },
  { id: 10, brand: 'Huawei', model: 'Pura 70 Ultra', price: 140000, category: 'Flagship', stock: 3, rating: 4.7, images: ['images/huawei-pura-70.png'], features: ['Retractable camera', 'XMAGE imaging', 'Satellite calling', 'Kunlun Glass'] },

  // MID-RANGE
  { id: 11, brand: 'Samsung', model: 'Galaxy A55', price: 55000, category: 'Mid-range', stock: 30, rating: 4.5, images: ['images/midrange-phone.png'], features: ['Premium build', 'Awesome camera', 'IP67 rating', 'Knox Security'] },
  { id: 12, brand: 'Google', model: 'Pixel 7a', price: 48000, category: 'Mid-range', stock: 18, rating: 4.6, images: ['images/pixel-7a.png'], features: ['Tensor G2', 'Wireless charging', 'IP67 rating', 'Pixel Camera'] },
  { id: 13, brand: 'Nothing', model: 'Phone (2)', price: 75000, category: 'Mid-range', stock: 12, rating: 4.7, images: ['images/nothing-phone-2.png'], features: ['Glyph Interface', 'Nothing OS 2.0', 'Snapdragon 8+ Gen 1', 'LTPO Display'] },
  { id: 14, brand: 'Redmi', model: 'Note 13 Pro+ 5G', price: 58000, category: 'Mid-range', stock: 40, rating: 4.4, images: ['images/redmi-note-13.png'], features: ['200MP Camera', '120W HyperCharge', 'IP68 rating', '1.5K Curved display'] },
  { id: 15, brand: 'Realme', model: '12 Pro+', price: 52000, category: 'Mid-range', stock: 22, rating: 4.3, images: ['images/midrange-phone.png'], features: ['Periscope portrait camera', 'Luxury watch design', '120Hz Curved OLED', '67W Charging'] },
  { id: 16, brand: 'Vivo', model: 'V30 Pro', price: 65000, category: 'Mid-range', stock: 15, rating: 4.5, images: ['images/midrange-phone.png'], features: ['ZEISS Co-engineered', 'Portrait Aura Light', 'Slim design', '5000mAh battery'] },
  { id: 17, brand: 'Motorola', model: 'Edge 50 Pro', price: 59000, category: 'Mid-range', stock: 10, rating: 4.4, images: ['images/moto-edge-50.png'], features: ['Pantone validated display', '125W Fast charging', 'IP68 rating', 'AI Camera'] },
  { id: 18, brand: 'Poco', model: 'X6 Pro', price: 45000, category: 'Mid-range', stock: 35, rating: 4.6, images: ['images/poco-x6-pro.png'], features: ['Dimensity 8300-Ultra', '120Hz CrystalRes', '64MP OIS', 'Xiaomi HyperOS'] },
  { id: 19, brand: 'Infinix', model: 'Note 40 Pro+', price: 38000, category: 'Mid-range', stock: 50, rating: 4.3, images: ['images/infinix-note-40.png'], features: ['100W All-Round FastCharge', 'MagCharge', 'Active Halo lighting', 'Dimensity 7020'] },
  { id: 20, brand: 'Tecno', model: 'Camon 30 Premier', price: 48000, category: 'Mid-range', stock: 20, rating: 4.4, images: ['images/camon-30.png'], features: ['Triple 50MP Cameras', 'Sony IMX890 Main', 'LTPO Display', 'Premium Suede back'] },

  // BUDGET
  { id: 21, brand: 'Samsung', model: 'Galaxy A15', price: 22000, category: 'Budget', stock: 60, rating: 4.2, images: ['images/modern-budget.png'], features: ['Super AMOLED display', '5000mAh battery', '25W Fast charging', '4 years OS updates'] },
  { id: 22, brand: 'Redmi', model: '13C', price: 16500, category: 'Budget', stock: 100, rating: 4.1, images: ['images/redmi-note-13.png'], features: ['90Hz 6.74" display', '50MP AI camera', 'Massive battery', 'Sleek design'] },
  { id: 23, brand: 'Tecno', model: 'Spark 20 Pro', price: 24000, category: 'Budget', stock: 45, rating: 4.3, images: ['images/tecno-spark-20.png'], features: ['108MP Main camera', '120Hz FHD+ display', 'Helio G99 chipset', 'Stereo Dual Speaker'] },
  { id: 24, brand: 'Infinix', model: 'Smart 8', price: 12500, category: 'Budget', stock: 150, rating: 4.0, images: ['images/budget-phone.png'], features: ['90Hz Punch-hole', 'Massive 5000mAh', 'Dynamic Port', 'Magic Ring'] },
  { id: 25, brand: 'Nokia', model: 'G42 5G', price: 28000, category: 'Budget', stock: 25, rating: 4.2, images: ['images/nokia-g42.png'], features: ['QuickFix repairability', '3-day battery life', 'Sustainability focus', 'Snappy 5G'] },
  { id: 26, brand: 'Realme', model: 'C67', price: 21000, category: 'Budget', stock: 35, rating: 4.2, images: ['images/midrange-phone.png'], features: ['108MP 3x In-sensor Zoom', 'Snapdragon 685', 'Ultra Slim 7.59mm', '33W SuperVOOC'] },
  { id: 27, brand: 'Oppo', model: 'A18', price: 18000, category: 'Budget', stock: 55, rating: 4.1, images: ['images/modern-budget.png'], features: ['90Hz Sunlight display', 'Large 5000mAh', '300% Ultra Volume', 'IP54 Water resistance'] },
  { id: 28, brand: 'Itel', model: 'P55+', price: 15500, category: 'Budget', stock: 80, rating: 4.0, images: ['images/budget-phone.png'], features: ['45W HyperCharge', '5000mAh battery', 'Punch-hole display', '90Hz Refresh rate'] },
  { id: 29, brand: 'Motorola', model: 'G34 5G', price: 23000, category: 'Budget', stock: 30, rating: 4.3, images: ['images/moto-edge-50.png'], features: ['Fast 5G performance', '120Hz display', 'Dolby Atmos', 'Premium glass design'] },
  { id: 30, brand: 'Samsung', model: 'Galaxy A05', price: 14500, category: 'Budget', stock: 90, rating: 4.0, images: ['images/modern-budget.png'], features: ['6.7" Large screen', '50MP Main camera', '5000mAh battery', 'Helio G85'] },

  // USED / REFURBISHED
  { id: 31, brand: 'Apple', model: 'iPhone 13 (Used)', price: 72000, category: 'Used', stock: 5, rating: 4.4, images: ['images/iphone-15-pro-max.png'], features: ['Good condition', 'Battery health 88%+', '6 months warranty', 'Original screen'] },
  { id: 32, brand: 'Samsung', model: 'Galaxy S21 Ultra (Used)', price: 55000, category: 'Used', stock: 3, rating: 4.3, images: ['images/galaxy-s24-ultra.png'], features: ['Minor scratches', 'Amazing zoom', '12GB RAM', 'Original charger included'] },
  { id: 33, brand: 'Apple', model: 'iPhone 11 (Refurbished)', price: 42000, category: 'Used', stock: 10, rating: 4.2, images: ['images/used-iphone-11.png'], features: ['Grade A condition', 'New battery', '1 year warranty', 'Full accessories'] },
  { id: 34, brand: 'Google', model: 'Pixel 6 (Used)', price: 35000, category: 'Used', stock: 7, rating: 4.5, images: ['images/pixel-7a.png'], features: ['Like new', 'Box & Charger', 'Clean IMEI', 'Pure Android'] },
  { id: 35, brand: 'Samsung', model: 'Galaxy Note 20 Ultra (Used)', price: 48000, category: 'Used', stock: 2, rating: 4.1, images: ['images/galaxy-s24-ultra.png'], features: ['S Pen working', 'Slight screen burn-in', 'Powerful specs', 'Fast 5G'] },
  { id: 36, brand: 'OnePlus', model: '9 Pro (Used)', price: 38000, category: 'Used', stock: 4, rating: 4.2, images: ['images/midrange-phone.png'], features: ['Good condition', 'Warp charge included', 'QHD+ Display', 'Snapdragon 888'] },
  { id: 37, brand: 'Xiaomi', model: 'Mi 11 (Used)', price: 28000, category: 'Used', stock: 6, rating: 4.0, images: ['images/xiaomi-14-ultra.png'], features: ['Average condition', 'Harman Kardon audio', 'Excellent camera', 'High refresh rate'] },
  { id: 38, brand: 'Huawei', model: 'Mate 40 Pro (Used)', price: 45000, category: 'Used', stock: 1, rating: 4.4, images: ['images/huawei-pura-70.png'], features: ['Excellent condition', 'Leica cameras', 'Curved screen', 'No Google services'] },
  { id: 39, brand: 'Apple', model: 'iPhone XR (Used)', price: 25000, category: 'Used', stock: 15, rating: 4.1, images: ['images/used-iphone-11.png'], features: ['Multiple colors', 'Battery 82%+', 'Perfect for kids', 'Face ID works'] },
  { id: 40, brand: 'Samsung', model: 'Galaxy S10+ (Used)', price: 22000, category: 'Used', stock: 8, rating: 4.0, images: ['images/galaxy-s24-ultra.png'], features: ['Classical flagship', 'Expandable storage', 'Headphone jack', 'Quad HD display'] },
  { id: 41, brand: 'Sony', model: 'Xperia 5 II (Used)', price: 26000, category: 'Used', stock: 4, rating: 4.2, images: ['images/midrange-phone.png'], features: ['Compact size', '120Hz display', 'Good battery', 'Japanese version'] }
];
