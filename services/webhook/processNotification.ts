import { fetchEmailDetails, markEmailAsRead } from "../email/graphMailService";
import type { Notification } from "../../types";

export async function processNotification(notification: Notification) {
  try {
    const mailbox = process.env.SHARED_MAILBOX!;
    const emailId = notification.resourceData.id;

    const mail = await fetchEmailDetails(emailId, mailbox);

    if (mail.isRead) {
      console.log(`🔁 Email ${emailId} already read → skipping`);
      return;
    }

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
    console.error("❌ Error processing notification:", err);
  }
}
