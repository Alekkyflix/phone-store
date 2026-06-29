-- ============================================================
-- SUPABASE SEED SCRIPT — Phone Management System
-- Run this in: Supabase Dashboard > SQL Editor
-- SAFE TO RUN MULTIPLE TIMES — fully idempotent
-- ============================================================

-- 1. Create the phones (inventory) table
CREATE TABLE IF NOT EXISTS phones (
  id          SERIAL PRIMARY KEY,
  brand       TEXT NOT NULL,
  model       TEXT NOT NULL,
  price       INTEGER NOT NULL,
  category    TEXT NOT NULL CHECK (category IN ('Flagship', 'Mid-range', 'Budget', 'Used')),
  stock       INTEGER NOT NULL DEFAULT 0,
  rating      NUMERIC(2,1) DEFAULT 4.0,
  features    TEXT[] DEFAULT '{}',
  image_url   TEXT DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create the sales (transaction log) table
CREATE TABLE IF NOT EXISTS sales (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_id        INTEGER REFERENCES phones(id),
  phone_model     TEXT NOT NULL,
  phone_brand     TEXT NOT NULL DEFAULT '',
  quantity        INTEGER NOT NULL DEFAULT 1,
  price_sold      INTEGER NOT NULL,
  customer_name   TEXT,
  customer_phone  TEXT,
  payment_method  TEXT DEFAULT 'mpesa',
  staff_note      TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Auto-update function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Trigger — drop first so re-runs don't fail
DROP TRIGGER IF EXISTS phones_updated_at ON phones;
CREATE TRIGGER phones_updated_at
  BEFORE UPDATE ON phones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 5. Seed phones — skip rows that already exist (safe re-run)
INSERT INTO phones (brand, model, price, category, stock, rating, features) VALUES
-- FLAGSHIP
('Apple',   'iPhone 15 Pro Max',          159900, 'Flagship', 12, 4.9, ARRAY['Titanium design','A17 Pro chip','48MP Main camera','USB-C']),
('Samsung', 'Galaxy S24 Ultra',            145000, 'Flagship',  8, 4.8, ARRAY['Galaxy AI','200MP Camera','Snapdragon 8 Gen 3','S Pen included']),
('Google',  'Pixel 8 Pro',                 115000, 'Flagship', 15, 4.7, ARRAY['Tensor G3','Best AI Photos','7 years of updates','Super Actua display']),
('Xiaomi',  '14 Ultra',                    130000, 'Flagship',  5, 4.6, ARRAY['Leica Optics','Snapdragon 8 Gen 3','90W Fast charging','1-inch sensor']),
('OnePlus', '12',                           95000, 'Flagship', 20, 4.7, ARRAY['Hasselblad Camera','Snapdragon 8 Gen 3','5400mAh battery','100W Charging']),
('Apple',   'iPhone 15',                   110000, 'Flagship', 25, 4.8, ARRAY['Dynamic Island','A16 Bionic','48MP Main camera','USB-C']),
('Samsung', 'Galaxy Z Fold 5',             185000, 'Flagship',  4, 4.5, ARRAY['Large screen','Slimmer hinge','Taskbar-style navigation','S Pen support']),
('Sony',    'Xperia 1 V',                  135000, 'Flagship',  6, 4.4, ARRAY['4K HDR OLED','Pro photography','Hi-Res Audio','5000mAh battery']),
('Asus',    'ROG Phone 8 Pro',             125000, 'Flagship', 10, 4.9, ARRAY['Gaming beast','165Hz Display','AirTriggers','AniMe Vision']),
('Huawei',  'Pura 70 Ultra',               140000, 'Flagship',  3, 4.7, ARRAY['Retractable camera','XMAGE imaging','Satellite calling','Kunlun Glass']),
-- MID-RANGE
('Samsung', 'Galaxy A55',                   55000, 'Mid-range', 30, 4.5, ARRAY['Premium build','Awesome camera','IP67 rating','Knox Security']),
('Google',  'Pixel 7a',                     48000, 'Mid-range', 18, 4.6, ARRAY['Tensor G2','Wireless charging','IP67 rating','Pixel Camera']),
('Nothing', 'Phone (2)',                     75000, 'Mid-range', 12, 4.7, ARRAY['Glyph Interface','Nothing OS 2.0','Snapdragon 8+ Gen 1','LTPO Display']),
('Redmi',   'Note 13 Pro+ 5G',              58000, 'Mid-range', 40, 4.4, ARRAY['200MP Camera','120W HyperCharge','IP68 rating','1.5K Curved display']),
('Realme',  '12 Pro+',                      52000, 'Mid-range', 22, 4.3, ARRAY['Periscope portrait camera','Luxury watch design','120Hz Curved OLED','67W Charging']),
('Vivo',    'V30 Pro',                      65000, 'Mid-range', 15, 4.5, ARRAY['ZEISS Co-engineered','Portrait Aura Light','Slim design','5000mAh battery']),
('Motorola','Edge 50 Pro',                  59000, 'Mid-range', 10, 4.4, ARRAY['Pantone validated display','125W Fast charging','IP68 rating','AI Camera']),
('Poco',    'X6 Pro',                       45000, 'Mid-range', 35, 4.6, ARRAY['Dimensity 8300-Ultra','120Hz CrystalRes','64MP OIS','Xiaomi HyperOS']),
('Infinix', 'Note 40 Pro+',                 38000, 'Mid-range', 50, 4.3, ARRAY['100W All-Round FastCharge','MagCharge','Active Halo lighting','Dimensity 7020']),
('Tecno',   'Camon 30 Premier',             48000, 'Mid-range', 20, 4.4, ARRAY['Triple 50MP Cameras','Sony IMX890 Main','LTPO Display','Premium Suede back']),
-- BUDGET
('Samsung', 'Galaxy A15',                   22000, 'Budget',  60, 4.2, ARRAY['Super AMOLED display','5000mAh battery','25W Fast charging','4 years OS updates']),
('Redmi',   '13C',                          16500, 'Budget', 100, 4.1, ARRAY['90Hz 6.74" display','50MP AI camera','Massive battery','Sleek design']),
('Tecno',   'Spark 20 Pro',                 24000, 'Budget',  45, 4.3, ARRAY['108MP Main camera','120Hz FHD+ display','Helio G99 chipset','Stereo Dual Speaker']),
('Infinix', 'Smart 8',                      12500, 'Budget', 150, 4.0, ARRAY['90Hz Punch-hole','Massive 5000mAh','Dynamic Port','Magic Ring']),
('Nokia',   'G42 5G',                       28000, 'Budget',  25, 4.2, ARRAY['QuickFix repairability','3-day battery life','Sustainability focus','Snappy 5G']),
('Realme',  'C67',                          21000, 'Budget',  35, 4.2, ARRAY['108MP 3x In-sensor Zoom','Snapdragon 685','Ultra Slim 7.59mm','33W SuperVOOC']),
('Oppo',    'A18',                          18000, 'Budget',  55, 4.1, ARRAY['90Hz Sunlight display','Large 5000mAh','300% Ultra Volume','IP54 Water resistance']),
('Itel',    'P55+',                         15500, 'Budget',  80, 4.0, ARRAY['45W HyperCharge','5000mAh battery','Punch-hole display','90Hz Refresh rate']),
('Motorola','G34 5G',                       23000, 'Budget',  30, 4.3, ARRAY['Fast 5G performance','120Hz display','Dolby Atmos','Premium glass design']),
('Samsung', 'Galaxy A05',                   14500, 'Budget',  90, 4.0, ARRAY['6.7" Large screen','50MP Main camera','5000mAh battery','Helio G85']),
-- USED / REFURBISHED
('Apple',   'iPhone 13 (Used)',             72000, 'Used',  5, 4.4, ARRAY['Good condition','Battery health 88%+','6 months warranty','Original screen']),
('Samsung', 'Galaxy S21 Ultra (Used)',      55000, 'Used',  3, 4.3, ARRAY['Minor scratches','Amazing zoom','12GB RAM','Original charger included']),
('Apple',   'iPhone 11 (Refurbished)',      42000, 'Used', 10, 4.2, ARRAY['Grade A condition','New battery','1 year warranty','Full accessories']),
('Google',  'Pixel 6 (Used)',               35000, 'Used',  7, 4.5, ARRAY['Like new','Box & Charger','Clean IMEI','Pure Android']),
('Samsung', 'Galaxy Note 20 Ultra (Used)',  48000, 'Used',  2, 4.1, ARRAY['S Pen working','Slight screen burn-in','Powerful specs','Fast 5G']),
('OnePlus', '9 Pro (Used)',                 38000, 'Used',  4, 4.2, ARRAY['Good condition','Warp charge included','QHD+ Display','Snapdragon 888']),
('Xiaomi',  'Mi 11 (Used)',                 28000, 'Used',  6, 4.0, ARRAY['Average condition','Harman Kardon audio','Excellent camera','High refresh rate']),
('Huawei',  'Mate 40 Pro (Used)',           45000, 'Used',  1, 4.4, ARRAY['Excellent condition','Leica cameras','Curved screen','No Google services']),
('Apple',   'iPhone XR (Used)',             25000, 'Used', 15, 4.1, ARRAY['Multiple colors','Battery 82%+','Perfect for kids','Face ID works']),
('Samsung', 'Galaxy S10+ (Used)',           22000, 'Used',  8, 4.0, ARRAY['Classical flagship','Expandable storage','Headphone jack','Quad HD display']),
('Sony',    'Xperia 5 II (Used)',           26000, 'Used',  4, 4.2, ARRAY['Compact size','120Hz display','Good battery','Japanese version'])
ON CONFLICT DO NOTHING;

-- 6. Row Level Security
ALTER TABLE phones ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales  ENABLE ROW LEVEL SECURITY;

-- Drop existing policies before recreating (safe re-run)
DROP POLICY IF EXISTS "Public can read phones"        ON phones;
DROP POLICY IF EXISTS "Service role can manage phones" ON phones;
DROP POLICY IF EXISTS "Anyone can record a sale"      ON sales;
DROP POLICY IF EXISTS "Service role can manage sales"  ON sales;

-- Phones: anyone can read, only service_role can write
CREATE POLICY "Public can read phones"         ON phones FOR SELECT USING (true);
CREATE POLICY "Service role can manage phones" ON phones FOR ALL    USING (auth.role() = 'service_role');

-- Sales: anyone can insert (customer orders + staff), service_role has full access
CREATE POLICY "Anyone can record a sale"       ON sales  FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role can manage sales"  ON sales  FOR ALL    USING (auth.role() = 'service_role');

-- 7. RPC helper functions (called by n8n and the React app)

-- adjust_stock: Add or subtract stock by ID (positive = restock, negative = sale/reduce)
CREATE OR REPLACE FUNCTION adjust_stock(p_id INT, p_delta INT)
RETURNS void AS $$
BEGIN
  UPDATE phones
  SET stock = GREATEST(0, stock + p_delta)
  WHERE id = p_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- decrement_stock: Reduce stock by model name (used by customer checkout)
CREATE OR REPLACE FUNCTION decrement_stock(p_model TEXT, p_qty INT DEFAULT 1)
RETURNS void AS $$
BEGIN
  UPDATE phones
  SET stock = GREATEST(0, stock - p_qty)
  WHERE LOWER(model) = LOWER(p_model);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;