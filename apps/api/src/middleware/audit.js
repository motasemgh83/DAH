const prisma = require('../prisma');
function audit(action, entityType, entityIdSelector) {
  return async (req, res, next) => {
    res.on('finish', async () => {
      if (res.statusCode >= 400) return;
      try {
        const entityId = typeof entityIdSelector === 'function' ? entityIdSelector(req, res) : req.params[entityIdSelector || 'id'];
        await prisma.auditLog.create({
          data: { actorId: req.user?.id, action, entityType, entityId, details: { body: req.body, params: req.params, query: req.query } }
        });
      } catch (_e) {}
    });
    next();
  };
}
module.exports = audit;
