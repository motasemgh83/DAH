const prisma = require('../prisma');
const { normalizeArabicFormValues } = require('../services/normalizationService');
async function technicianOverview(req,res,next){ try{ const [requests, workOrders, notifications]=await Promise.all([prisma.maintenanceRequest.findMany({ where:{ assignedToId:req.user.id }, orderBy:{ createdAt:'desc' }, take:10 }), prisma.workOrder.findMany({ where:{ technicianId:req.user.id }, orderBy:{ createdAt:'desc' }, take:10 }), prisma.notification.findMany({ where:{ userId:req.user.id }, orderBy:{ createdAt:'desc' }, take:10 })]); res.json({ data:{ requests, workOrders, notifications } }); }catch(error){ next(error);} }
async function normalizeArabicPayload(req,res,next){ try{ res.json({ data: normalizeArabicFormValues(req.body) }); }catch(error){ next(error);} }
module.exports={ technicianOverview, normalizeArabicPayload };
