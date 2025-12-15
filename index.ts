import dotenv from "dotenv";
dotenv.config();

import { createWebhookApp } from "./services/webhook/webhookApp";
import {
  ensureSubscription,
  scheduleRenewal,
} from "./services/subsrciption/subscriptionManager";
import { getMailboxResource } from "./services/subsrciption/subscriptionApi";
import { startPollingUnreadMails } from "./services/mail/unreadPolling";

const PORT = parseInt(process.env.PORT || "3000", 10);

async function main() {
  try {
    const app = createWebhookApp();
    app.listen(PORT, () => {
      console.log(`Webhook listening on port ${PORT}`);
    });

    if (!process.env.SHARED_MAILBOX_ID) {
      throw new Error("SHARED_MAILBOX environment variable is required");
    }

    const resource = getMailboxResource(process.env.SHARED_MAILBOX_ID);

    const notificationUrl = `${process.env.WEBHOOK_URL}/webhook`;

    const subscription = await ensureSubscription(resource, notificationUrl);
    scheduleRenewal(subscription, resource, notificationUrl);

    console.log("Mailbot ready and monitoring mailbox.");

    startPollingUnreadMails();
  } catch (err) {
    console.error("Failed to start mailbot:", err);
    process.exit(1);
  }
}

main();
