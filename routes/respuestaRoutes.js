const express = require("express");
const { body, param } = require("express-validator");
const respuestaControllers = require("../controllers/Respuestacontrollers");
const { verificarValidaciones } = require("../middlewares/validaciones");
const verificarToken = require('../middlewares/verificarToken');
 
const router = express.Router();
 
const validarRespuesta = [
  body("capa").isMongoId().withMessage("La capa no es válida"),
  body("tipo")
    .isIn(["resolve", "complicate"])
    .withMessage("El tipo debe ser resolve o complicate"),
  body("contenido").notEmpty().withMessage("El contenido es obligatorio"),
  body("respuestaPadre")
    .optional()
    .isMongoId()
    .withMessage("La respuesta padre no es válida"),
];
 
const validarCapaId = [
  param("capaId").isMongoId().withMessage("La capa no es válida"),
];
 
router.post("/", verificarToken, validarRespuesta, verificarValidaciones, respuestaControllers.crear);
router.get("/capa/:capaId", validarCapaId, verificarValidaciones, respuestaControllers.listarPorCapa);
 
module.exports = router;