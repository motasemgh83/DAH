const prisma = require('../prisma');
const { createWorkOrderSchema, scheduleWorkOrderSchema } = require('../validation/schemas');
const { notifyUser } = require('../services/notificationService');
const workOrderNo = () => `WO-${Date.now()}`;
async function listWorkOrders(req,res,next){ try{
  const where={ ...(req.query.status?{status:req.query.status}:{}), ...(req.query.requestId?{requestId:req.query.requestId}:{}) };
  if(req.user.role==='TECHNICIAN') where.technicianId=req.user.id;
  const data=await prisma.workOrder.findMany({ where, include:{ request:true, technician:true, costEntries:true }, orderBy:{ createdAt:'desc' }});
  res.json({ data });
}catch(error){ next(error);} }
async function createWorkOrder(req,res,next){ try{
  const payload=createWorkOrderSchema.parse(req.body);
  const data=await prisma.workOrder.create({ data:{ workOrderNo:workOrderNo(), requestId:payload.requestId, title:payload.title, technicianId:payload.technicianId, estimatedCost:payload.estimatedCost }, include:{ request:true, technician:true } });
  await prisma.maintenanceRequest.update({ where:{ id:payload.requestId }, data:{ status:'IN_PROGRESS' } });
  if(payload.technicianId){ await notifyUser(payload.technicianId,'New work order assigned',`You have been assigned ${data.workOrderNo}`,payload.requestId); }
  res.status(201).json({ data });
}catch(error){ next(error);} }
async function scheduleWorkOrder(req,res,next){ try{
  const payload=scheduleWorkOrderSchema.parse(req.body);
  const data=await prisma.workOrder.update({ where:{ id:req.params.id }, data:{ status:'SCHEDULED', scheduledStart:new Date(payload.scheduledStart), scheduledEnd:new Date(payload.scheduledEnd) }, include:{ technician:true, request:true } });
  if(data.technicianId){ await notifyUser(data.technicianId,'Work order scheduled',`Work order ${data.workOrderNo} has a new schedule`,data.requestId); }
  res.json({ data });
}catch(error){ next(error);} }
module.exports={ listWorkOrders, createWorkOrder, scheduleWorkOrder };
