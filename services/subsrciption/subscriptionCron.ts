import cron from "node-cron";
import { ensureSubscription } from "./subscriptionManager";
import { getMailboxResource } from "./subscriptionApi";

if (!process.env.SHARED_MAILBOX_ID) {
  throw new Error("SHARED_MAILBOX_ID environment variable is required");
}

const resource = getMailboxResource(process.env.SHARED_MAILBOX_ID);
const notificationUrl = `${process.env.WEBHOOK_URL}/webhook`;

cron.schedule("0 3 * * *", async () => {
  console.log(
    `[Subscription Cron] Checking subscription at ${new Date().toISOString()}`
  );

  try {
    const sub = await ensureSubscription(resource, notificationUrl);
    console.log(
      `[Subscription Cron] Subscription ID: ${sub.id}, expires: ${sub.expirationDateTime}`
    );
  } catch (error) {
    console.error("[Subscription Cron] Error ensuring subscription:", error);
  }
});

console.log("Subscription cron initialized. Will run every day at 3:00 AM");
