/**
 * Direct Multi-Channel Notification Dispatcher for LeemsDTT
 * Handles Email dispatch (Web3Forms/Formspree) + Instant Phone/WhatsApp alerts
 * Primary Notification Target: leemsdtt.valortrust@gmail.com | +234 803 953 5043
 */

export interface NotificationPayload {
  formType: "Contact Inquiry" | "Distributor Application" | "Bulk Quote Request" | "Newsletter Subscription";
  fullName?: string;
  contactName?: string;
  companyName?: string;
  email: string;
  phone?: string;
  preferredSize?: string;
  quantity?: string;
  volume?: string;
  location?: string;
  businessType?: string;
  message?: string;
  source?: string;
}

export interface NotificationResult {
  emailSent: boolean;
  alertSent: boolean;
  message?: string;
}

const PRIMARY_EMAIL = "leemsdtt.valortrust@gmail.com";
const PRIMARY_PHONE = "+2348039535043"; // WhatsApp / Phone line

/**
 * Format human-readable notification text
 */
export function formatNotificationText(payload: NotificationPayload): string {
  const dateStr = new Date().toLocaleString("en-NG", {
    timeZone: "Africa/Lagos",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const lines = [
    `🔔 NEW LEEMSDTT NOTIFICATION: ${payload.formType.toUpperCase()}`,
    `----------------------------------------`,
    `⏰ Date: ${dateStr} (WAT)`,
    `📧 Email: ${payload.email}`,
    payload.phone ? `📞 Phone/WhatsApp: ${payload.phone}` : null,
    payload.fullName ? `👤 Name: ${payload.fullName}` : null,
    payload.contactName ? `👤 Contact: ${payload.contactName}` : null,
    payload.companyName ? `🏢 Company: ${payload.companyName}` : null,
    payload.businessType ? `🏷️ Business Type: ${payload.businessType}` : null,
    payload.location ? `📍 Location/Region: ${payload.location}` : null,
    payload.preferredSize ? `📦 Packaging Size: ${payload.preferredSize}` : null,
    payload.quantity || payload.volume ? `📊 Quantity/Volume: ${payload.quantity || payload.volume}` : null,
    payload.source ? `🌐 Source Page: ${payload.source}` : null,
    payload.message ? `\n💬 Message:\n${payload.message}` : null,
    `----------------------------------------`,
    `LeemsDTT • ValorTrust Integrated Services Ltd (RC 9268182)`,
    `Website: https://www.leemsdtt.name.ng/`,
  ];

  return lines.filter(Boolean).join("\n");
}

/**
 * Creates a pre-filled direct WhatsApp link for instant contact
 */
export function createWhatsAppInquiryUrl(payload: Partial<NotificationPayload>): string {
  const cleanPhone = PRIMARY_PHONE.replace(/[^0-9]/g, "");
  const text = `Hello LeemsDTT, I just submitted an inquiry on your website:
- Type: ${payload.formType || "Product Inquiry"}
- Name: ${payload.fullName || payload.contactName || "Interested Customer"}
- Email: ${payload.email || "N/A"}
${payload.phone ? `- Phone: ${payload.phone}\n` : ""}${payload.preferredSize ? `- Preferred Size: ${payload.preferredSize}\n` : ""}${payload.quantity || payload.volume ? `- Quantity: ${payload.quantity || payload.volume}\n` : ""}${payload.message ? `- Details: ${payload.message}\n` : ""}
I look forward to your response!`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text.trim())}`;
}

/**
 * Dispatch notification to Email and Instant Alert Webhooks
 */
export async function sendNotificationAlert(payload: NotificationPayload): Promise<NotificationResult> {
  const result: NotificationResult = {
    emailSent: false,
    alertSent: false,
  };

  const formattedMessage = formatNotificationText(payload);
  const subject = `[New ${payload.formType}] ${payload.fullName || payload.contactName || payload.companyName || payload.email}`;

  // 1. DIRECT EMAIL DISPATCH
  // Use Web3Forms access key from environment or fallback public key
  const web3Key =
    (import.meta as any).env?.VITE_WEB3FORMS_ACCESS_KEY ||
    "6257a3e7-3b2d-4e92-8094-a1bf64393698";

  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: web3Key,
        email: PRIMARY_EMAIL,
        subject: subject,
        from_name: "LeemsDTT Portal Alert",
        replyto: payload.email,
        message: formattedMessage,
        details: payload,
      }),
    });

    if (res.ok) {
      const data = await res.json().catch(() => ({ success: true }));
      if (data.success !== false) {
        result.emailSent = true;
        console.log("✅ Email notification delivered successfully to", PRIMARY_EMAIL);
      } else {
        console.warn("⚠️ Web3Forms returned notice:", data.message);
      }
    }
  } catch (emailErr) {
    console.warn("Direct email fetch notification error:", emailErr);
  }

  // 2. INSTANT PHONE / WHATSAPP ALERT DISPATCH (CallMeBot WhatsApp Gateway)
  // If user configured CallMeBot API key in .env, trigger free WhatsApp notification to phone
  const callMeBotKey = (import.meta as any).env?.VITE_CALLMEBOT_APIKEY;
  const targetPhone = (import.meta as any).env?.VITE_WHATSAPP_PHONE || PRIMARY_PHONE;

  if (callMeBotKey && targetPhone) {
    try {
      const cleanPhone = targetPhone.replace(/[^0-9]/g, "");
      const shortAlert = `*LeemsDTT Alert: ${payload.formType}*\nFrom: ${payload.fullName || payload.email}\nPhone: ${payload.phone || "N/A"}\nMsg: ${(payload.message || "New lead").slice(0, 150)}`;
      const url = `https://api.callmebot.com/whatsapp.php?phone=${cleanPhone}&text=${encodeURIComponent(shortAlert)}&apikey=${callMeBotKey}`;
      fetch(url, { mode: "no-cors" }).catch(() => {});
      result.alertSent = true;
    } catch (e) {
      console.warn("WhatsApp alert error:", e);
    }
  }

  // 3. INSTANT TELEGRAM BOT PUSH ALERT (If configured)
  const tgToken = (import.meta as any).env?.VITE_TELEGRAM_BOT_TOKEN;
  const tgChatId = (import.meta as any).env?.VITE_TELEGRAM_CHAT_ID;

  if (tgToken && tgChatId) {
    try {
      await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: tgChatId,
          text: formattedMessage,
        }),
      });
      result.alertSent = true;
    } catch (e) {
      console.warn("Telegram alert dispatch error:", e);
    }
  }

  return result;
}

// Backward-compatible alias for existing code
export const sendEmailNotification = sendNotificationAlert;
