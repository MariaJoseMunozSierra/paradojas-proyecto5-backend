const express = require("express");
const { body } = require("express-validator");
const votoControllers = require("../controllers/votoControllers");
const { verificarValidaciones } = require("../middlewares/validaciones");
const verificarToken = require("../middlewares/verificarToken");
 
const router = express.Router();
 
const validarVoto = [
  body("respuesta").isMongoId().withMessage("La respuesta no es válida"),
  body("valor")
    .isIn(["agree", "disagree", "abstain"])
    .withMessage("El voto debe ser agree, disagree o abstain"),
];
 
router.post("/", verificarToken, validarVoto, verificarValidaciones, votoControllers.votar);
 
module.exports = router;