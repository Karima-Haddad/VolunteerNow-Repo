const express = require("express");
const router = express.Router();
const {
  updateProfile,
  getMyProfile,
  getUserProfile
} = require("../controllers/profilController");

const upload = require("../middleware/upload");
const { requireLogin } = require("../middleware/auth");
router.get("/me", requireLogin, getMyProfile);
router.get("/:id", getUserProfile);
router.put("/update/:id", requireLogin, upload.single("photo"), updateProfile);




module.exports = router;










// router.get("/all", requireLogin, getAllUsers);
// router.get("/:id", getPublicProfile);


 


//const express = require("express");
//const router = express.Router();

//router.get("/me", (req, res) => {
  //res.json({ test: "ok" });
//});

//module.exports = router;

