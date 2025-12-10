const express = require("express");
const router = express.Router();
const { requireLogin } = require("../middleware/auth");
const { getNonTraitees } = require("../controllers/notificationController");

router.get("/non-traitees", requireLogin, getNonTraitees);

module.exports = router;
