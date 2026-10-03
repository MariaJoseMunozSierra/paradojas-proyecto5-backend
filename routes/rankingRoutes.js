const express = require("express");
const rankingControllers = require("../controllers/rankingControllers");
 
const router = express.Router();
 
router.get("/", rankingControllers.obtener);
 
module.exports = router;