import { z } from "zod";

export const CampaignBasicsSchema = z.object({
  title: z.string().min(3).max(120),
  city: z.string().min(2).max(120),
  state: z.string().min(2).max(40),
  goalDollars: z.number().positive().max(10_000_000),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});

export type CampaignBasicsInput = z.infer<typeof CampaignBasicsSchema>;

export const CampaignUpdateSchema = z.object({
  title: z.string().min(3).max(120).optional(),
  city: z.string().min(2).max(120).optional(),
  state: z.string().min(2).max(40).optional(),
  goalCents: z.number().int().min(100).max(1_000_000_000).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  coverUrl: z.string().url().optional(),
  status: z.enum(["draft", "live", "ended", "not_funded", "suspended"]).optional(),
});

export type CampaignUpdateInput = z.infer<typeof CampaignUpdateSchema>;


