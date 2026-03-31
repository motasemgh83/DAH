const prisma = require('../prisma');
async function listInventory(req,res,next){ try{ res.json({ data: await prisma.inventoryItem.findMany({ orderBy:{ quantity:'asc' } }) }); }catch(error){ next(error);} }
module.exports={ listInventory };
