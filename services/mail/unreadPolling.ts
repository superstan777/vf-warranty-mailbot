import { fetchEmails, markEmailAsRead } from "../mail/graphMailService";

const POLL_INTERVAL_MINUTES = 15;

export function startPollingUnreadEmails() {
  async function pollUnreadEmails() {
    try {
      const mails = await fetchEmails();
      const unreadMails = mails.filter((m: any) => !m.isRead);

      if (unreadMails.length === 0) {
        console.log("No unread emails found.");
        return;
      }

      console.log(`Found ${unreadMails.length} unread email(s)`);

      // for (const mail of unreadMails) {
      //   console.log("=== Unread Mail ===");
      //   console.log("ID:", mail.id);
      //   console.log("From:", mail.from?.emailAddress?.address || "Unknown");
      //   console.log("Subject:", mail.subject || "(No Subject)");
      //   console.log("Received:", mail.receivedDateTime);
      //   console.log("=================\n");

      //   try {
      //     // await markEmailAsRead(mail.id);
      //     console.log(`Marked email ${mail.id} as read.`);
      //   } catch (error) {
      //     console.error(`Failed to mark email ${mail.id} as read:`, error);
      //   }
      // }
    } catch (error) {
      console.error("Error polling unread emails:", error);
    }
  }

  setInterval(pollUnreadEmails, POLL_INTERVAL_MINUTES * 60 * 1000);

  pollUnreadEmails();
}
