import { z } from "zod";

const AssigneeId = z
  .string()
  .cuid()
  .nullable()
  .optional(); 

export const createIssueSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().min(1, "Description is required"),
  assigneeId: AssigneeId,            
});

export const updateIssueSchema = createIssueSchema
  .partial() 
  .extend({
    status: z.enum(["OPEN", "IN_PROGRESS", "CLOSED"]).optional(),
    assigneeId: AssigneeId,           
  })
  .refine((obj) => Object.keys(obj).length > 0, {
    message: "No fields to update",
  });

export type CreateIssueInput = z.infer<typeof createIssueSchema>;
export type UpdateIssueInput = z.infer<typeof updateIssueSchema>;
