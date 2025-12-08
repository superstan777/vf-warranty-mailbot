import axios from "axios";

export async function getAppToken(): Promise<string> {
  const url = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`;

  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", process.env.CLIENT_ID!);
  params.append("client_secret", process.env.CLIENT_SECRET!);
  params.append("scope", "https://graph.microsoft.com/.default");

  const res = await axios.post(url, params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  return res.data.access_token;
}
