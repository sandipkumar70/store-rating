const express=require("express");
const router=express.Router();
const { addStore, getStores } = require("../controllers/storeController");
const{verifyToken,checkRole}=require("../middleware/authMiddleware");

router.post("/", verifyToken, checkRole("admin"), addStore);
router.get("/", verifyToken, getStores);

module.exports = router;