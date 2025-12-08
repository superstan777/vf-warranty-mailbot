import { createWebhookApp } from "./services/webhook/webhookApp";

import {
  ensureSubscription,
  scheduleRenewal,
} from "./services/subsrciption/subscriptionManager";
import { getMailboxResource } from "./services/subsrciption/subscriptionApi";

const PORT = parseInt(process.env.PORT || "3000", 10);
const WEBHOOK_URL = process.env.WEBHOOK_URL || `http://localhost:${PORT}`;

async function main() {
  try {
    // 1️⃣ Start webhook server
    const app = createWebhookApp();
    app.listen(PORT, () => {
      console.log(`🚀 Webhook listening on port ${PORT}`);
    });

    // 2️⃣ Ensure subscription exists
    if (!process.env.SHARED_MAILBOX) {
      throw new Error("SHARED_MAILBOX environment variable is required");
    }

    const resource = getMailboxResource(process.env.SHARED_MAILBOX);
    const notificationUrl = `${WEBHOOK_URL}/webhook`;

    const subscription = await ensureSubscription(resource, notificationUrl);

    // 3️⃣ Schedule automatic renewal
    scheduleRenewal(subscription, resource, notificationUrl);

    console.log("✅ Mailbot ready and monitoring mailbox.");
  } catch (err) {
    console.error("❌ Failed to start mailbot:", err);
    process.exit(1);
  }
}

// Start
main();
