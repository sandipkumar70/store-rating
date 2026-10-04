const express=require("express");
const router=express.Router();
const {submitRating}= require("../controllers/ratingController");
const { verifyToken, checkRole } = require("../middleware/authMiddleware");


router.post("/", verifyToken, checkRole("user"), submitRating);

module.exports=router;