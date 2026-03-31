require('dotenv').config();
const bcrypt = require('bcryptjs');
const prisma = require('./prisma');
async function upsertUser(email, name, role, locale='en'){ const passwordHash=await bcrypt.hash('Password123!',10); return prisma.user.upsert({ where:{ email }, update:{ name, role, locale, passwordHash, isActive:true }, create:{ email, name, role, locale, passwordHash } }); }
async function main(){
 const superadmin=await upsertUser('superadmin@daralhai.com','Super Admin','SUPERADMIN');
 const manager=await upsertUser('manager@daralhai.com','Operations Manager','MANAGER');
 const supervisor=await upsertUser('supervisor@daralhai.com','Field Supervisor','SUPERVISOR');
 const technician=await upsertUser('technician1@daralhai.com','Technician One','TECHNICIAN','ar');
 await prisma.companySetting.upsert({ where:{ id:'company-default' }, update:{ companyName:'Dar Al HAI', timezone:'Asia/Kuwait', defaultLocale:'en', technicianLocale:'ar', workingHoursJson:{ sunday:['08:00','17:00'], monday:['08:00','17:00'], tuesday:['08:00','17:00'], wednesday:['08:00','17:00'], thursday:['08:00','16:00'] }, holidaysJson:['2026-01-01','2026-02-26'] }, create:{ id:'company-default', companyName:'Dar Al HAI', timezone:'Asia/Kuwait', defaultLocale:'en', technicianLocale:'ar', workingHoursJson:{ sunday:['08:00','17:00'], monday:['08:00','17:00'], tuesday:['08:00','17:00'], wednesday:['08:00','17:00'], thursday:['08:00','16:00'] }, holidaysJson:['2026-01-01','2026-02-26'] } });
 const hvac=await prisma.serviceCategory.upsert({ where:{ name:'HVAC' }, update:{}, create:{ name:'HVAC' } });
 const plumbing=await prisma.serviceCategory.upsert({ where:{ name:'Plumbing' }, update:{}, create:{ name:'Plumbing' } });
 await prisma.slaPolicy.createMany({ data:[{ name:'Critical SLA', priority:'CRITICAL', responseMinutes:15, resolutionMinutes:240 },{ name:'High SLA', priority:'HIGH', responseMinutes:30, resolutionMinutes:480 },{ name:'Medium SLA', priority:'MEDIUM', responseMinutes:60, resolutionMinutes:1440 },{ name:'Low SLA', priority:'LOW', responseMinutes:120, resolutionMinutes:2880 }], skipDuplicates:true });
 await prisma.escalationRule.createMany({ data:[{ name:'Critical escalation', priority:'CRITICAL', thresholdMinutes:30, notifyRole:'MANAGER' },{ name:'High escalation', priority:'HIGH', thresholdMinutes:60, notifyRole:'SUPERVISOR' }], skipDuplicates:true });
 await prisma.customStatusDefinition.createMany({ data:[{ entityType:'MaintenanceRequest', key:'qa_review', label:'QA Review' },{ entityType:'WorkOrder', key:'vendor_pending', label:'Vendor Pending' }], skipDuplicates:true });
 await prisma.customFieldDefinition.createMany({ data:[{ entityType:'MaintenanceRequest', key:'tenant_reference', label:'Tenant Reference', fieldType:'text', required:false },{ entityType:'MaintenanceRequest', key:'access_window', label:'Access Window', fieldType:'text', required:false }], skipDuplicates:true });
 const client=await prisma.client.create({ data:{ name:'Kuwait Towers Residences' } }); const property=await prisma.property.create({ data:{ name:'Tower A', clientId:client.id } }); const branch=await prisma.branch.create({ data:{ name:'Main Branch', propertyId:property.id } }); const unit=await prisma.unit.create({ data:{ name:'Unit 101', branchId:branch.id } });
 const asset1=await prisma.asset.create({ data:{ assetCode:'AHU-101', name:'Air Handling Unit 101', serviceCategoryId:hvac.id, unitId:unit.id } });
 await prisma.asset.create({ data:{ assetCode:'PMP-202', name:'Water Pump 202', serviceCategoryId:plumbing.id, unitId:unit.id } });
 const urgentTag=await prisma.tag.upsert({ where:{ name:'urgent' }, update:{}, create:{ name:'urgent' } });
 await prisma.inventoryItem.createMany({ data:[{ sku:'FLT-01', name:'HVAC Filter', quantity:3, minQuantity:5, unitCost:12.5 },{ sku:'BRG-09', name:'Pump Bearing', quantity:9, minQuantity:4, unitCost:20 },{ sku:'MTR-05', name:'Motor Capacitor', quantity:2, minQuantity:3, unitCost:35 }], skipDuplicates:true });
 const request=await prisma.maintenanceRequest.create({ data:{ requestNo:'REQ-1001', title:'AC not cooling in Unit 101', description:'Tenant reports warm air from vents and unusual noise.', status:'AWAITING_APPROVAL', priority:'HIGH', clientId:client.id, unitId:unit.id, assetId:asset1.id, serviceCategoryId:hvac.id, requestedByName:'Ahmed Resident', requestedByPhone:'+965-5550001', assignedToId:technician.id, responseDueAt:new Date(Date.now()+30*60000), resolutionDueAt:new Date(Date.now()+8*60*60000) } });
 await prisma.maintenanceRequestTag.create({ data:{ requestId:request.id, tagId:urgentTag.id } });
 const workOrder=await prisma.workOrder.create({ data:{ workOrderNo:'WO-1001', requestId:request.id, title:'Diagnose AHU issue', status:'SCHEDULED', technicianId:technician.id, scheduledStart:new Date(Date.now()+2*60*60000), scheduledEnd:new Date(Date.now()+4*60*60000), estimatedCost:50, checklistJson:['inspect_pump','clean_filter','test_power'] } });
 await prisma.preventivePlan.create({ data:{ title:'Monthly AHU Inspection', assetId:asset1.id, frequencyDays:30, nextDueAt:new Date(Date.now()+14*24*60*60000), checklistJson:['inspect_pump','clean_filter','verify_safety'] } });
 await prisma.comment.createMany({ data:[{ requestId:request.id, authorId:supervisor.id, content:'Initial inspection required before approval.', isInternal:true },{ requestId:request.id, authorId:technician.id, content:'تم الوصول إلى الموقع وسيتم فحص الوحدة.', isInternal:false }] });
 await prisma.attachment.create({ data:{ requestId:request.id, fileName:'ahu-photo.jpg', url:'https://example.com/ahu-photo.jpg', uploadedBy:technician.email } });
 await prisma.notification.createMany({ data:[{ userId:technician.id, requestId:request.id, title:'New assignment', message:'You have been assigned REQ-1001' },{ userId:supervisor.id, requestId:request.id, title:'Approval pending', message:'REQ-1001 is waiting for approval' }] });
 await prisma.approval.create({ data:{ requestId:request.id, approverId:supervisor.id, decision:'PENDING', notes:'Awaiting final supervisor visit' } });
 const filter=await prisma.inventoryItem.findUnique({ where:{ sku:'FLT-01' } });
 await prisma.costEntry.create({ data:{ title:'Initial filter replacement estimate', amount:25, requestId:request.id, workOrderId:workOrder.id, inventoryItemId:filter.id, createdById:manager.id } });
 await prisma.kPIRecord.createMany({ data:[{ metricKey:'avg_response_minutes', metricValue:42 },{ metricKey:'mttr_hours', metricValue:3.5 },{ metricKey:'technician_utilization', metricValue:78 }], skipDuplicates:true });
 await prisma.auditLog.createMany({ data:[{ actorId:superadmin.id, action:'SEED_SYSTEM', entityType:'System', entityId:'company-default', details:{ note:'Initial dataset created' } },{ actorId:manager.id, action:'CREATE_REQUEST', entityType:'MaintenanceRequest', entityId:request.id, details:{ requestNo:request.requestNo } }] });
 console.log('Database seeded successfully');
}
main().catch((e)=>{ console.error(e); process.exit(1); }).finally(async()=>{ await prisma.$disconnect(); });
