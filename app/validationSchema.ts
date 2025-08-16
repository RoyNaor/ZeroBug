import { z } from 'zod';

export const createIssueSchema = z.object({
    title: z.string().min(1, 'Title is required').max(255),
    description: z.string().min(1, 'Description is required'),
});

export const updateIssueSchema = createIssueSchema
  .partial() // title/description become optional
  .extend({
    status: z.enum(["OPEN", "IN_PROGRESS", "CLOSED"]).optional(),
  })
  .refine((obj) => Object.keys(obj).length > 0, {
    message: "No fields to update",
  });

export type CreateIssueInput = z.infer<typeof createIssueSchema>;
export type UpdateIssueInput = z.infer<typeof updateIssueSchema>;