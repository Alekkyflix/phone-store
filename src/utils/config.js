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
