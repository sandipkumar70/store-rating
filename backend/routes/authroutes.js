const express = require("express");
const router = express.Router();
const { signup, login, updatePassword } = require("../controllers/authcontroller");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/signup", signup);
router.post("/login", login);
router.put("/password", verifyToken, updatePassword);

module.exports = router;