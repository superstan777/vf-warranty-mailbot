import {
  fetchEmailDetails,
  fetchAttachments,
  markEmailAsRead,
  sendEmail,
} from "../mail/graphMailService";

import { addNoteWithAttachments } from "../notes/notesApi";
import type { AddNotePayload } from "../notes/notesApi";
import type { Notification } from "../../types";

interface GraphAttachment {
  id: string;
  "@odata.type": string;
  name: string;
  contentBytes: string;
  contentType: string;
}

export async function processNotification(notification: Notification) {
  try {
    const emailId = notification.resourceData.id;

    const mail = await fetchEmailDetails(emailId);
    const fromAddress = mail.from?.emailAddress?.address || "";
    const content = mail.body?.content || "";
    const incNumber = mail.subject || "";

    let attachments: GraphAttachment[] = [];
    if (mail.hasAttachments) {
      const fetched = await fetchAttachments(emailId);
      attachments = (fetched as GraphAttachment[]).filter(
        (a) => a["@odata.type"] === "#microsoft.graph.fileAttachment"
      );
    }

    const payload: AddNotePayload = {
      user_name: fromAddress,
      content,
      inc_number: incNumber,
      origin: "mail",
      graph_id: mail.id,
      attachments: attachments.map((att) => ({
        graph_id: att.id,
        file_name: att.name,
        content_type: att.contentType,
        content_base_64: att.contentBytes,
      })),
    };

    const res = await addNoteWithAttachments(payload);

    const shouldMarkRead =
      res.success === true ||
      res.errorCode === "INCIDENT_NOT_FOUND" ||
      res.errorCode === "INCIDENT_NOT_IN_PROGRESS";

    if (shouldMarkRead) {
      try {
        await markEmailAsRead(emailId);
      } catch (err) {
        console.error("Failed to mark email as read:", err);
      }
    } else {
      console.warn(
        "Backend returned failure → email will not be marked as read."
      );
    }

    if (fromAddress) {
      try {
        await sendEmail(fromAddress, res.message || "Note processed.");
      } catch (err) {
        console.error("Error sending reply email:", err);
      }
    } else {
      console.warn("No sender address found → cannot send reply");
    }

    console.log(res);
  } catch (err) {
    console.error("Error processing notification:", err);
  }
}
