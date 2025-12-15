import { fetchEmails } from "../mail/graphMailService";
import { processMailById } from "../mail/processMail";

const POLL_INTERVAL_MINUTES = 15;

export function startPollingUnreadMails() {
  async function pollUnreadMails() {
    try {
      const mails = await fetchEmails();
      const unreadMails = mails.filter((m: any) => !m.isRead);

      if (!unreadMails.length) {
        console.log("No unread emails found.");
        return;
      }

      console.log(`Found ${unreadMails.length} unread email(s)`);

      for (const mail of unreadMails) {
        try {
          await processMailById(mail.id);
        } catch (err) {
          console.error(`Failed to process email ${mail.id}`, err);
        }
      }
    } catch (error) {
      console.error("Error polling unread emails:", error);
    }
  }

  setInterval(pollUnreadMails, POLL_INTERVAL_MINUTES * 60 * 1000);
  pollUnreadMails();
}
