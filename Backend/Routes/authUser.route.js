
const express = require("express");

const router = express.Router();

const loginController = require("../controllers/authUser.controller");

router.post("/login", loginController);

module.exports = router;