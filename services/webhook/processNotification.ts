import {
  fetchEmailDetails,
  markEmailAsRead,
  sendEmail,
} from "../mail/graphMailService";
import { addNote, AddNotePayload } from "../notes/notesApi";
import type { Notification } from "../../types";

export async function processNotification(notification: Notification) {
  try {
    const emailId = notification.resourceData.id;

    const mail = await fetchEmailDetails(emailId);
    const fromAddress = mail.from?.emailAddress?.address;

    if (!fromAddress) {
      console.warn("Email has no sender address, skipping.");
      return;
    }

    const content = mail.body?.content || "";
    const incNumber = mail.subject || "";

    if (!content || !incNumber) {
      console.warn("Missing content or INC number, marking as read.");
      await markEmailAsRead(emailId);
      return;
    }

    const payload: AddNotePayload = {
      user_name: fromAddress,
      content,
      inc_number: incNumber,
      origin: "mail",
    };

    let res;
    try {
      res = await addNote(payload);
    } catch (err) {
      console.error("Technical error adding note:", err);
      res = {
        success: false,
        message: "Failed to process note due to technical error.",
      };
    }

    try {
      await sendEmail(fromAddress, res.message);
    } catch (err) {
      console.error("Error sending reply:", err);
    }

    const shouldMarkRead =
      res.success ||
      (res.errorCode !== undefined &&
        ["INCIDENT_NOT_FOUND", "INCIDENT_NOT_IN_PROGRESS"].includes(
          res.errorCode
        ));
    if (shouldMarkRead) {
      try {
        await markEmailAsRead(emailId);
      } catch (err) {
        console.error("Failed to mark email as read:", err);
      }
    }
  } catch (err) {
    console.error("Error processing notification:", err);
  }
}
