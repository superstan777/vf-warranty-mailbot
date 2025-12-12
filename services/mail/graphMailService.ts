import axios from "axios";
import { getAppToken } from "../auth/auth";

export async function fetchEmails() {
  const token = await getAppToken();

  const url = `https://graph.microsoft.com/v1.0/users/${process.env.SHARED_MAILBOX_ID}/mailFolders/Inbox/messages?$top=999&$filter=isRead eq false&$orderby=receivedDateTime desc`;

  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.value;
  } catch (err: any) {
    console.error("Failed to fetch unread emails:", err.response?.data || err);
    throw err;
  }
}

export async function fetchEmailDetails(emailId: string) {
  const token = await getAppToken();

  const url = `https://graph.microsoft.com/v1.0/users/${process.env.SHARED_MAILBOX_ID}/messages/${emailId}`;

  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (err: any) {
    console.error("Failed to fetch email:", err.response?.data || err);
    throw err;
  }
}

export async function markEmailAsRead(emailId: string) {
  const token = await getAppToken();

  const url = `https://graph.microsoft.com/v1.0/users/${process.env.SHARED_MAILBOX_ID}/messages/${emailId}`;

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

    console.log(`Marked as read: ${emailId}`);
  } catch (err: any) {
    console.error("Failed to mark email as read:", err.response?.data || err);
    throw err;
  }
}

export async function sendEmail(to: string, message: string) {
  try {
    const token = await getAppToken();

    const url = `https://graph.microsoft.com/v1.0/users/${process.env.SHARED_MAILBOX_ID}/sendMail`;

    const email = {
      message: {
        subject: "VF Warranty Assistant",
        body: {
          contentType: "Text",
          content: message,
        },
        toRecipients: [
          {
            emailAddress: { address: to },
          },
        ],
      },
      saveToSentItems: "true",
    };

    await axios.post(url, email, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log(`Mail sent to: ${to}`);
  } catch (err: any) {
    console.error("Failed to send reply:", err.response?.data || err.message);
  }
}

export async function fetchAttachments(emailId: string) {
  const token = await getAppToken();
  const url = `https://graph.microsoft.com/v1.0/users/${process.env.SHARED_MAILBOX_ID}/messages/${emailId}/attachments`;

  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data.value;
  } catch (err: any) {
    console.error("Failed to fetch attachments:", err.response?.data || err);
    throw err;
  }
}
