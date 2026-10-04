const express=require("express");
const router=express.Router();
const { getOwnerDashboard } = require("../controllers/ownerController");
const { verifyToken, checkRole } = require("../middleware/authMiddleware");

router.get("/dashboard", verifyToken, checkRole("owner"), getOwnerDashboard);

module.exports = router;
