import { fetchEmailDetails, markEmailAsRead } from "../mail/graphMailService";
import type { Notification } from "../../types";

export async function processNotification(notification: Notification) {
  try {
    const emailId = notification.resourceData.id;

    const mail = await fetchEmailDetails(emailId);

    console.log("\n=== 📧 NEW EMAIL (Webhook) ===");
    console.log("ID:", mail.id);
    console.log("From:", mail.from?.emailAddress?.address || "Unknown");
    console.log("Subject:", mail.subject || "(No Subject)");
    console.log("Received:", mail.receivedDateTime);
    console.log("Read:", mail.isRead ? "Yes" : "No");
    console.log(
      "Body Preview:",
      mail.bodyPreview?.substring(0, 200) || "(No preview)"
    );
    console.log("================================\n");

    // await markEmailAsRead(emailId, mailbox);
  } catch (err) {
    console.error(" Error processing notification:", err);
  }
}
