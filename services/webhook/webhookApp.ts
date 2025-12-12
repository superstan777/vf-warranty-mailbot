import express from "express";
import { processNotification } from "./processNotification";
import type { NotificationPayload } from "../../types";
import { isDuplicate } from "../cache/dedupe";

export function createWebhookApp() {
  const app = express();
  app.use(express.json());

  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/webhook", async (req, res) => {
    try {
      if (req.query.validationToken) {
        console.log("Validation request (query)");
        return res.status(200).send(req.query.validationToken);
      }

      const payload: NotificationPayload = req.body;

      if (payload.validationTokens?.length) {
        console.log("Validation request (body)");
        return res.status(200).send(payload.validationTokens[0]);
      }

      if (payload.value?.length) {
        console.log(`Received ${payload.value.length} notification(s)`);

        for (const notification of payload.value) {
          const mailId = notification.resourceData.id;

          const duplicate = await isDuplicate(mailId);
          if (duplicate) {
            console.log(`Duplicate mail ${mailId}, skipping.`);
            continue;
          }

          await processNotification(notification);
        }

        return res.status(202).send("Accepted");
      }

      res.status(200).send("No notifications");
    } catch (err) {
      console.error("Webhook error:", err);
      res.status(500).send("Internal Server Error");
    }
  });

  return app;
}
