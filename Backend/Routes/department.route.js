const express = require("express");
const router = express.Router();
const { createDepartment, getAllDepartments } = require("../Controllers/department.controller");
const { protectHR } = require("../Middlewares/Auth.Middleware");


router.use(protectHR);

router.post("/", createDepartment);
router.get("/", getAllDepartments);

module.exports = router;