export interface Notification {
  subscriptionId: string;
  changeType: string;
  resource: string;
  resourceData: {
    id: string;
    "@odata.type": string;
    "@odata.id": string;
  };
  clientState?: string;
  subscriptionExpirationDateTime: string;
  tenantId: string;
}

export interface NotificationPayload {
  value: Notification[];
  validationTokens?: string[];
}

export interface Subscription {
  id: string;
  resource: string;
  changeType: string;
  clientState: string;
  notificationUrl: string;
  expirationDateTime: string;
}
