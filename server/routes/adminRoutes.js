const express = require("express");
const router = express.Router();
const {
  checkAdminExists,
  createAdminByAdmin,
} = require("../controllers/adminController");


router.get("/exists", checkAdminExists);
router.post("/create-admin", createAdminByAdmin); // <-- changed here

module.exports = router;