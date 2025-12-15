import type { Notification } from "../../types";
import { processMailById } from "../mail/processMail";

export async function processNotification(notification: Notification) {
  try {
    const emailId = notification.resourceData.id;
    const res = await processMailById(emailId);
    console.log(res);
  } catch (err) {
    console.error("Error processing notification:", err);
  }
}
