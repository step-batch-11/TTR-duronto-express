import { z } from "zod";

export const drawFaceUpSchema = z.object({
  id: z.string().regex(/^[1-5]$/, "Card position must be 1–5"),
});

export const claimRouteSchema = z.object({
  routeId: z.string(),

  routeData: z.object({
    routeLength: z.number().min(1),
  }),

  cardsUsed: z.object({
    colorCardUsed: z.string().nullable(),
    colorCardCount: z.number().min(0),
    wildCardCount: z.number().min(0),
  }),
});
