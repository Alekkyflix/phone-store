/**
 * Default configuration for the application
 * These values are used if no saved configuration is found in storage
 */
export const DEFAULT_CONFIG = {
  webhookUrl: import.meta.env.VITE_N8N_WEBHOOK_URL || "",
  shopName: "Tech Mobile Store",
  location: "Murang'a, Kenya",
  inquiryNumber: "+254712345678",
  whatsappGroup: "https://chat.whatsapp.com/your-group-link",
  orderFormUrl: "https://forms.google.com/your-form-link",
};

/**
 * Utility to get the correct image path, handling the base URL.
 * @param {string} path - The relative path to the image (e.g., 'images/iphone.png')
 * @returns {string} - The full URL to the image
 */
export const getImagePath = (path) => {
  if (!path) return "";
  const base = import.meta.env.BASE_URL || "/";
  // Remove leading slash from path and trailing slash from base
  const cleanBase = base.endsWith("/") ? base : `${base}/`;
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${cleanBase}${cleanPath}`;
};

/**
 * Utility to get the correct webhook URL based on the environment.
 * In development, it uses the local proxy (/api/n8n) to bypass CORS.
 * In production, it uses the direct URL.
 * @param {string} url - The base n8n webhook URL
 * @returns {string} - The URL to use for fetch requests
 */
export const getWebhookUrl = (url) => {
  if (!url) return "";
  
  // Only apply proxy in development
  if (import.meta.env.DEV) {
    return url.replace('https://nairobiaicommunity.app.n8n.cloud', '/api/n8n');
  }
  
  return url;
};
