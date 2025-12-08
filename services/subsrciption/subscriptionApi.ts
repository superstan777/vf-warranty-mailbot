import axios from "axios";
import { getAppToken } from "../auth/auth";
import type { Subscription } from "../../types";

export interface CreateSubscriptionRequest {
  changeType: string;
  notificationUrl: string;
  resource: string;
  expirationDateTime: string;
  clientState?: string;
}

export async function createSubscription(
  resource: string,
  notificationUrl: string,
  expirationMinutes: number = 4230 // Max 3 days for enterprise apps
): Promise<Subscription> {
  const token = await getAppToken();

  const expirationDateTime = new Date();
  expirationDateTime.setMinutes(
    expirationDateTime.getMinutes() + expirationMinutes
  );

  const subscriptionData: CreateSubscriptionRequest = {
    changeType: "created",
    notificationUrl: notificationUrl,
    resource: resource,
    expirationDateTime: expirationDateTime.toISOString(),
    clientState: process.env.CLIENT_STATE || "mailbot-state",
  };

  const response = await axios.post(
    "https://graph.microsoft.com/v1.0/subscriptions",
    subscriptionData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}

export async function renewSubscription(
  subscriptionId: string,
  expirationMinutes: number = 4230
): Promise<Subscription> {
  const token = await getAppToken();

  const expirationDateTime = new Date();
  expirationDateTime.setMinutes(
    expirationDateTime.getMinutes() + expirationMinutes
  );

  const response = await axios.patch(
    `https://graph.microsoft.com/v1.0/subscriptions/${subscriptionId}`,
    {
      expirationDateTime: expirationDateTime.toISOString(),
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}

export async function listSubscriptions(): Promise<Subscription[]> {
  const token = await getAppToken();

  const response = await axios.get(
    "https://graph.microsoft.com/v1.0/subscriptions",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.value;
}

export async function deleteSubscription(
  subscriptionId: string
): Promise<void> {
  const token = await getAppToken();

  await axios.delete(
    `https://graph.microsoft.com/v1.0/subscriptions/${subscriptionId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

export function getMailboxResource(mailbox: string): string {
  return `/users/${mailbox}/mailFolders/Inbox/messages`;
}
