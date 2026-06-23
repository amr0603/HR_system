const express = require("express");
const router = express.Router();

const adminMiddleware = require("../Middlewares/Admin.Middleware");

const {
     createEmployee,
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee
} = require("../Controllers/employee.controller");

router.use(adminMiddleware);

router.post("/",createEmployee);
router.get("/", getAllEmployees);
router.get("/:id", getEmployeeById);
router.put("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);
module.exports = router;