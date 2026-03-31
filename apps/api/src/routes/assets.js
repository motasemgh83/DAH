const router = require("express").Router();
const c = require("../controllers/assetController");
const { authRequired, requirePermission } = require("../middleware/auth");

router.get("/", authRequired, requirePermission("assets:view"), c.listAssets);
router.get("/locations", authRequired, requirePermission("assets:view"), c.listLocations);
router.get("/preventive-plans", authRequired, requirePermission("assets:view"), c.listPreventivePlans);

module.exports = router;
