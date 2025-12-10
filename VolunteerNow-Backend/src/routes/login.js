const express = require("express");
const router = express.Router();
const { login, forgotPassword } = require('../controllers/loginController');
const { resetPassword } = require("../controllers/loginController");


router.post('/login',login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;