import {
  fetchEmailDetails,
  fetchAttachments,
  markEmailAsRead,
  sendEmail,
} from "./graphMailService";
import { addNoteWithAttachments } from "../notes/notesApi";
import type { AddNotePayload } from "../notes/notesApi";

interface GraphAttachment {
  id: string;
  "@odata.type": string;
  name: string;
  contentBytes: string;
  contentType: string;
}

export async function processMailById(emailId: string) {
  const mail = await fetchEmailDetails(emailId);

  const fromAddress = mail.from?.emailAddress?.address || "";
  const content = mail.body?.content || "";
  const incNumber = mail.subject || "";

  let attachments: GraphAttachment[] = [];
  if (mail.hasAttachments) {
    const fetched = await fetchAttachments(emailId);
    attachments = fetched.filter(
      (a: GraphAttachment) =>
        a["@odata.type"] === "#microsoft.graph.fileAttachment"
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
    res.errorCode === "INCIDENT_NOT_IN_PROGRESS" ||
    res.errorCode === "EMPTY_NOTE_CONTENT";

  if (shouldMarkRead) {
    await markEmailAsRead(emailId);
  }

  if (fromAddress) {
    await sendEmail(fromAddress, res.message || "Note processed.");
  }

  return res;
}
