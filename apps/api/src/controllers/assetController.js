const prisma = require('../prisma');
async function listAssets(req,res,next){ try{ const data=await prisma.asset.findMany({ include:{ unit:{ include:{ branch:{ include:{ property:{ include:{ client:true } } } } }, serviceCategory:true, preventivePlans:true, tags:{ include:{ tag:true } } } }); res.json({ data }); }catch(error){ next(error);} }
async function listLocations(req,res,next){ try{ res.json({ data: await prisma.client.findMany({ include:{ properties:{ include:{ branches:{ include:{ units:true } } } } } }) }); }catch(error){ next(error);} }
async function listPreventivePlans(req,res,next){ try{ res.json({ data: await prisma.preventivePlan.findMany({ include:{ asset:true }, orderBy:{ nextDueAt:'asc' } }) }); }catch(error){ next(error);} }
module.exports={ listAssets, listLocations, listPreventivePlans };
