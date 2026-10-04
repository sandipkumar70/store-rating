const express=require("express");
const router=express.Router();
const{getDashboard, getUsers, addUser, getUserById}=require("../controllers/adminController");
const { verifyToken, checkRole } = require("../middleware/authMiddleware");


router.get("/dashboard", verifyToken, checkRole("admin"), getDashboard);
router.get("/users", verifyToken, checkRole("admin"), getUsers);
router.post("/users", verifyToken, checkRole("admin"), addUser);
router.get("/users/:id", verifyToken, checkRole("admin"), getUserById);

module.exports=router;