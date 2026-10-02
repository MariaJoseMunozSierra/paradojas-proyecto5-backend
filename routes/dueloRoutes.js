const express = require("express");
const { body, param } = require("express-validator");
const dueloControllers = require("../controllers/dueloControllers");
const { verificarValidaciones } = require("../middlewares/validaciones");
const verificarToken = require("../middlewares/Verificartoken");
 
const router = express.Router();
 
const validarCrearDuelo = [
  body("paradoja").isMongoId().withMessage("La paradoja no es válida"),
  body("retado").isMongoId().withMessage("El usuario retado no es válido"),
];
 
const validarId = [param("id").isMongoId().withMessage("El duelo no es válido")];
 
const validarResponder = [
  ...validarId,
  body("aceptar").isBoolean().withMessage("aceptar debe ser true o false"),
];
 
const validarFinalizar = [
  ...validarId,
  body("ganador").isMongoId().withMessage("El ganador no es válido"),
];
 
router.post("/", verificarToken, validarCrearDuelo, verificarValidaciones, dueloControllers.crear);
router.get("/mios", verificarToken, dueloControllers.listarMisDuelos);
router.patch("/:id/responder", verificarToken, validarResponder, verificarValidaciones, dueloControllers.responder);
router.patch("/:id/finalizar", verificarToken, validarFinalizar, verificarValidaciones, dueloControllers.finalizar);
 
module.exports = router;