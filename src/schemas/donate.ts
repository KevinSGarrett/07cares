import { z } from "zod";
export const CreateIntentBody = z.object({
  amount: z.number().int().min(500),
  campaignId: z.string().min(1),
});
