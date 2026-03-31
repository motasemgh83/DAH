const { loginSchema } = require('../validation/schemas');
const { login } = require('../services/authService');
const { getPermissionsForRole } = require('../utils/permissions');
async function loginController(req,res,next){ try{ const payload=loginSchema.parse(req.body); res.json(await login(payload.email,payload.password)); }catch(error){ next(error);} }
async function meController(req,res){ res.json({ user:{ id:req.user.id,email:req.user.email,name:req.user.name,role:req.user.role,locale:req.user.locale,permissions:getPermissionsForRole(req.user.role)}}); }
module.exports={ loginController, meController };
