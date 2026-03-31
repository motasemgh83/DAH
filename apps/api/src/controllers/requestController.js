const prisma = require('../prisma');
const { createRequestSchema, requestCommentSchema, requestAttachmentSchema, approvalSchema, reopenSchema } = require('../validation/schemas');
const { notifyRoles, notifyUser } = require('../services/notificationService');
const requestNo = () => `REQ-${Date.now()}`;
async function listRequests(req,res,next){ try{
  const where = {
    ...(req.query.status ? { status:req.query.status } : {}),
    ...(req.query.priority ? { priority:req.query.priority } : {}),
    ...(req.query.clientId ? { clientId:req.query.clientId } : {}),
    ...(req.query.assignedToId ? { assignedToId:req.query.assignedToId } : {}),
    ...(req.query.search ? { OR:[{ title:{ contains:req.query.search, mode:'insensitive'} },{ description:{ contains:req.query.search, mode:'insensitive'} },{ requestNo:{ contains:req.query.search, mode:'insensitive'} }] } : {})
  };
  if(req.user.role==='TECHNICIAN') where.assignedToId=req.user.id;
  const data = await prisma.maintenanceRequest.findMany({ where, include:{ assignedTo:true, asset:true, serviceCategory:true, comments:{include:{author:true}}, attachments:true, approvals:true, tags:{include:{tag:true}} }, orderBy:{ createdAt:'desc' }});
  res.json({ data });
}catch(error){ next(error);} }
async function createRequest(req,res,next){ try{
  const payload=createRequestSchema.parse(req.body);
  const sla=await prisma.slaPolicy.findFirst({ where:{ priority:payload.priority } });
  const now=Date.now();
  const data=await prisma.maintenanceRequest.create({ data:{
    requestNo: requestNo(), title:payload.title, description:payload.description, priority:payload.priority, clientId:payload.clientId, unitId:payload.unitId, assetId:payload.assetId, serviceCategoryId:payload.serviceCategoryId, requestedByName:payload.requestedByName, requestedByPhone:payload.requestedByPhone, assignedToId:payload.assignedToId, dueAt: payload.dueAt ? new Date(payload.dueAt):null, responseDueAt:sla?new Date(now + sla.responseMinutes*60000):null, resolutionDueAt:sla?new Date(now + sla.resolutionMinutes*60000):(payload.dueAt?new Date(payload.dueAt):null)
  }});
  if(payload.tags?.length){ for(const tagName of payload.tags){ const tag=await prisma.tag.upsert({ where:{ name:tagName }, create:{ name:tagName }, update:{} }); await prisma.maintenanceRequestTag.create({ data:{ requestId:data.id, tagId:tag.id } }); } }
  if(payload.customFields?.length){ for(const item of payload.customFields){ await prisma.requestCustomFieldValue.create({ data:{ requestId:data.id, fieldDefinitionId:item.fieldDefinitionId, value:item.value } }); } }
  if(payload.assignedToId){ await notifyUser(payload.assignedToId,'New assigned maintenance request',`You have been assigned ${data.requestNo}`,data.id); }
  res.status(201).json({ data });
}catch(error){ next(error);} }
async function addComment(req,res,next){ try{
  const payload=requestCommentSchema.parse(req.body);
  const request=await prisma.maintenanceRequest.findUnique({ where:{ id:req.params.id } });
  if(!request) return res.status(404).json({ message:'Request not found' });
  const data=await prisma.comment.create({ data:{ requestId:req.params.id, authorId:req.user.id, content:payload.content, isInternal:payload.isInternal }, include:{ author:true } });
  if(request.assignedToId && request.assignedToId!==req.user.id){ await notifyUser(request.assignedToId,'New request comment',`A comment was added to ${request.requestNo}`,request.id); }
  res.status(201).json({ data });
}catch(error){ next(error);} }
async function addAttachment(req,res,next){ try{
  const payload=requestAttachmentSchema.parse(req.body);
  const request=await prisma.maintenanceRequest.findUnique({ where:{ id:req.params.id } });
  if(!request) return res.status(404).json({ message:'Request not found' });
  const data=await prisma.attachment.create({ data:{ requestId:req.params.id, fileName:payload.fileName, url:payload.url, uploadedBy:req.user.email }});
  res.status(201).json({ data });
}catch(error){ next(error);} }
async function approveRequest(req,res,next){ try{
  const payload=approvalSchema.parse(req.body);
  const data=await prisma.maintenanceRequest.update({ where:{ id:req.params.id }, data:{ status:'APPROVED', approvals:{ create:{ approverId:req.user.id, decision:'APPROVED', notes:payload.notes } } }, include:{ approvals:true }});
  if(data.assignedToId){ await notifyUser(data.assignedToId,'Request approved',`Request ${data.requestNo} has been approved`,data.id); }
  res.json({ data });
}catch(error){ next(error);} }
async function reopenRequest(req,res,next){ try{
  const payload=reopenSchema.parse(req.body);
  const existing=await prisma.maintenanceRequest.findUnique({ where:{ id:req.params.id } });
  if(!existing) return res.status(404).json({ message:'Request not found' });
  const data=await prisma.maintenanceRequest.update({ where:{ id:req.params.id }, data:{ status:'REOPENED', reopenCount:{ increment:1 }, comments:{ create:{ authorId:req.user.id, content:`Reopen reason: ${payload.reason}`, isInternal:true } } }});
  await notifyRoles(['SUPERVISOR','MANAGER'],'Request reopened',`Request ${existing.requestNo} was reopened`,existing.id);
  res.json({ data });
}catch(error){ next(error);} }
module.exports={ listRequests, createRequest, addComment, addAttachment, approveRequest, reopenRequest };
