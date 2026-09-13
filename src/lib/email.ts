/**
 * Email Notification Bridge for LeemsDTT
 * Re-exports the unified notification system from notifications.ts
 */

export {
  type NotificationPayload as InquiryEmailPayload,
  type NotificationPayload,
  type NotificationResult,
  sendNotificationAlert,
  sendEmailNotification,
  formatNotificationText,
  createWhatsAppInquiryUrl,
} from "./notifications";
