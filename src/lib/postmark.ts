import { ServerClient } from "postmark";
export const postmark = new ServerClient(process.env.POSTMARK_SERVER_TOKEN!);

export async function sendReceiptEmail(to: string, subject: string, htmlBody: string) {
  return postmark.sendEmail({ From: "noreply@yourdomain.com", To: to, Subject: subject, HtmlBody: htmlBody });
}
