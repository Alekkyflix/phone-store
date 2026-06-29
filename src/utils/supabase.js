/**
 * supabase.js
 *
 * Lightweight Supabase REST client — no npm package needed.
 * Uses the Supabase REST API directly via fetch().
 *
 * Required .env variables:
 *   VITE_SUPABASE_URL=https://your-project.supabase.co
 *   VITE_SUPABASE_ANON_KEY=eyJ...  (public anon key — safe to expose)
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    '[Supabase] Missing env vars. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.'
  );
}

const headers = () => ({
  'Content-Type': 'application/json',
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
});

// ─────────────────────────────────────────────────────────────
//  READ FUNCTIONS
// ─────────────────────────────────────────────────────────────

/**
 * Fetch all phones with stock > 0, ordered by category and brand.
 * @returns {Promise<Object[]>}
 */
export const fetchPhones = async () => {
  if (!SUPABASE_URL) return [];
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/phones?select=*&stock=gt.0&order=category.asc,brand.asc`,
    { headers: headers() }
  );
  if (!res.ok) { console.error('[Supabase] fetchPhones failed:', res.status); return []; }
  const data = await res.json();
  return data.map((p) => ({
    id: p.id, brand: p.brand, model: p.model, price: p.price,
    category: p.category, stock: p.stock, rating: parseFloat(p.rating),
    features: p.features || [], images: p.image_url ? [p.image_url] : [],
  }));
};

/**
 * Fetch ALL phones including out-of-stock (for Staff Portal).
 * @returns {Promise<Object[]>}
 */
export const fetchAllPhones = async () => {
  if (!SUPABASE_URL) return [];
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/phones?select=*&order=category.asc,brand.asc`,
    { headers: headers() }
  );
  if (!res.ok) { console.error('[Supabase] fetchAllPhones failed:', res.status); return []; }
  return res.json();
};

/**
 * Fetch recent sales for Staff Portal history.
 * @param {number} limit
 * @returns {Promise<Object[]>}
 */
export const fetchRecentSales = async (limit = 50) => {
  if (!SUPABASE_URL) return [];
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/sales?select=*&order=created_at.desc&limit=${limit}`,
    { headers: headers() }
  );
  if (!res.ok) { console.error('[Supabase] fetchRecentSales failed:', res.status); return []; }
  return res.json();
};

// ─────────────────────────────────────────────────────────────
//  WRITE FUNCTIONS
//  The React app writes directly to Supabase — no n8n needed.
//  n8n is still called separately for notifications/WhatsApp.
// ─────────────────────────────────────────────────────────────

/**
 * Record a sale (works for both staff SaleForm and customer checkout).
 * @param {{ phone_model, phone_brand, price_sold, customer_name, customer_phone, payment_method, staff_note? }} sale
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const insertSale = async (sale) => {
  if (!SUPABASE_URL) return { success: false, error: 'Supabase not configured' };
  const res = await fetch(`${SUPABASE_URL}/rest/v1/sales`, {
    method: 'POST',
    headers: { ...headers(), Prefer: 'return=representation' },
    body: JSON.stringify(sale),
  });
  if (!res.ok) { const e = await res.text(); console.error('[Supabase] insertSale failed:', e); return { success: false, error: e }; }
  const data = await res.json();
  return { success: true, data: data[0] };
};

/**
 * Adjust stock by ±delta using phone ID. Positive = restock, negative = reduce.
 * Stock never drops below 0 (enforced in DB via GREATEST(0,...)).
 * Used by: Staff Portal → Inventory (Restock / Reduce)
 * @param {number} phoneId
 * @param {number} delta  e.g. +10 to restock, -3 to reduce
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const adjustStock = async (phoneId, delta) => {
  if (!SUPABASE_URL) return { success: false, error: 'Supabase not configured' };
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/adjust_stock`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ p_id: Number(phoneId), p_delta: delta }),
  });
  if (!res.ok) { const e = await res.text(); console.error('[Supabase] adjustStock failed:', e); return { success: false, error: e }; }
  return { success: true };
};

/**
 * Decrement stock by model name (case-insensitive match).
 * Used by: Customer checkout (model name is known, ID may not be)
 * @param {string} model
 * @param {number} [qty=1]
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const decrementStockByModel = async (model, qty = 1) => {
  if (!SUPABASE_URL) return { success: false, error: 'Supabase not configured' };
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/decrement_stock`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ p_model: model, p_qty: qty }),
  });
  if (!res.ok) { const e = await res.text(); console.error('[Supabase] decrementStockByModel failed:', e); return { success: false, error: e }; }
  return { success: true };
};

/**
 * Add a brand-new phone model to the inventory.
 * Used by: Staff Portal → Inventory → New Model tab
 * @param {{ brand, model, price, stock, category?, features?, image_url? }} phone
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const insertPhone = async (phone) => {
  if (!SUPABASE_URL) return { success: false, error: 'Supabase not configured' };
  const res = await fetch(`${SUPABASE_URL}/rest/v1/phones`, {
    method: 'POST',
    headers: { ...headers(), Prefer: 'return=representation' },
    body: JSON.stringify({
      brand: phone.brand, model: phone.model, price: Number(phone.price),
      stock: Number(phone.stock), category: phone.category || 'Mid-range',
      features: phone.features || [], image_url: phone.image_url || '',
    }),
  });
  if (!res.ok) { const e = await res.text(); console.error('[Supabase] insertPhone failed:', e); return { success: false, error: e }; }
  const data = await res.json();
  return { success: true, data: data[0] };
};

/** Check if Supabase credentials are present in env. */
export const isSupabaseConfigured = () => Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
