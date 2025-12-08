import type { Subscription } from "../../types";
import {
  createSubscription,
  renewSubscription,
  listSubscriptions,
} from "./subscriptionApi";

const SUBSCRIPTION_RENEWAL_BUFFER_MINUTES = 60;

export async function ensureSubscription(
  resource: string,
  notificationUrl: string
): Promise<Subscription> {
  const subscriptions = await listSubscriptions();
  const existing = subscriptions.find(
    (s) => s.resource === resource && s.notificationUrl === notificationUrl
  );

  if (existing) {
    const expiration = new Date(existing.expirationDateTime).getTime();
    const now = Date.now();
    const minutesLeft = (expiration - now) / (1000 * 60);

    if (minutesLeft < SUBSCRIPTION_RENEWAL_BUFFER_MINUTES) {
      return await renewSubscription(existing.id);
    }

    return existing;
  }

  return await createSubscription(resource, notificationUrl);
}

export function scheduleRenewal(
  subscription: Subscription,
  resource: string,
  notificationUrl: string
) {
  const expiration = new Date(subscription.expirationDateTime).getTime();
  const now = Date.now();

  const msUntilRenewal =
    expiration - now - SUBSCRIPTION_RENEWAL_BUFFER_MINUTES * 60 * 1000;

  if (msUntilRenewal <= 0) return;

  setTimeout(async () => {
    try {
      const renewed = await renewSubscription(subscription.id);
      scheduleRenewal(renewed, resource, notificationUrl);
    } catch {
      const newSub = await ensureSubscription(resource, notificationUrl);
      scheduleRenewal(newSub, resource, notificationUrl);
    }
  }, msUntilRenewal);
}
