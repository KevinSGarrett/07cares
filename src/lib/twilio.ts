import twilio from "twilio";
const client = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);

export async function sendSms(toE164: string, body: string) {
  return client.messages.create({ to: toE164, messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID!, body });
}
