const express = require("express");
const router = express.Router();
const { createFaculty,getAllFaculties } = require("../controllers/facultyController");

router.post("/create-faculty", createFaculty);
router.get("/all-faculties", getAllFaculties);

module.exports = router;
