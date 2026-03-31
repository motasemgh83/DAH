const { z } = require('zod');
const loginSchema = z.object({ email: z.string().email(), password: z.string().min(8) });
const createRequestSchema = z.object({
  title: z.string().min(3), description: z.string().min(5),
  priority: z.enum(['LOW','MEDIUM','HIGH','CRITICAL']).default('MEDIUM'),
  clientId: z.string().optional(), unitId: z.string().optional(), assetId: z.string().optional(),
  serviceCategoryId: z.string().optional(), requestedByName: z.string().min(2), requestedByPhone: z.string().optional(),
  assignedToId: z.string().optional(), dueAt: z.string().datetime().optional(),
  tags: z.array(z.string()).optional(),
  customFields: z.array(z.object({ fieldDefinitionId: z.string(), value: z.string() })).optional()
});
const requestCommentSchema = z.object({ content: z.string().min(1), isInternal: z.boolean().default(true) });
const requestAttachmentSchema = z.object({ fileName: z.string().min(1), url: z.string().url() });
const approvalSchema = z.object({ notes: z.string().optional() });
const reopenSchema = z.object({ reason: z.string().min(3) });
const createWorkOrderSchema = z.object({ requestId: z.string(), title: z.string().min(3), technicianId: z.string().optional(), estimatedCost: z.number().nonnegative().default(0) });
const scheduleWorkOrderSchema = z.object({ scheduledStart: z.string().datetime(), scheduledEnd: z.string().datetime() });
const companySettingSchema = z.object({ companyName: z.string().min(2), timezone: z.string().min(2), defaultLocale: z.string().min(2), technicianLocale: z.string().min(2), workingHoursJson: z.any(), holidaysJson: z.any() });
module.exports = { loginSchema, createRequestSchema, requestCommentSchema, requestAttachmentSchema, approvalSchema, reopenSchema, createWorkOrderSchema, scheduleWorkOrderSchema, companySettingSchema };
