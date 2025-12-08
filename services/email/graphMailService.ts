// src/services/graph/GraphMailService.ts
import axios from "axios";
import { getAppToken } from "../auth/auth";

export async function fetchEmailDetails(emailId: string, mailbox: string) {
  const token = await getAppToken();

  const url = `https://graph.microsoft.com/v1.0/users/${mailbox}/messages/${emailId}?$select=id,subject,from,bodyPreview,receivedDateTime,isRead`;

  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (err: any) {
    console.error("❌ Failed to fetch email:", err.response?.data || err);
    throw err;
  }
}

export async function markEmailAsRead(emailId: string, mailbox: string) {
  const token = await getAppToken();

  const url = `https://graph.microsoft.com/v1.0/users/${mailbox}/messages/${emailId}`;

  try {
    await axios.patch(
      url,
      { isRead: true },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`✔️   Marked as read: ${emailId}`);
  } catch (err: any) {
    console.error(
      "❌ Failed to mark email as read:",
      err.response?.data || err
    );
    throw err;
  }
}
