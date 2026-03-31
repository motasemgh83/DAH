const prisma = require('../prisma');
async function adminOverview(req,res,next){ try{ const [users, notifications, auditLogs]=await Promise.all([prisma.user.findMany({ select:{ id:true, email:true, name:true, role:true, locale:true } }), prisma.notification.findMany({ take:10, orderBy:{ createdAt:'desc' } }), prisma.auditLog.findMany({ take:20, orderBy:{ createdAt:'desc' } })]); res.json({ data:{ users, notifications, auditLogs } }); }catch(error){ next(error);} }
module.exports={ adminOverview };
