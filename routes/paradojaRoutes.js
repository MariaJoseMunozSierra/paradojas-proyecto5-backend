const express = require("express");
const { body } = require("express-validator");
const paradojaControllers = require("../controllers/paradojaControllers");
const { verificarValidaciones } = require("../middlewares/validaciones");
const verificarToken = require("../middlewares/verificarToken");

const router = express.Router();

const validarParadoja = [
  body("titulo").notEmpty().withMessage("El título es obligatorio"),
  body("statement")
    .notEmpty()
    .withMessage("El statement es obligatorio")
    .isLength({ max: 300 })
    .withMessage("El statement no puede superar 300 caracteres"),
  body("categoria").notEmpty().withMessage("La categoría es obligatoria"),
  body("creador_id").notEmpty().withMessage("El creador_id es obligatorio"),
];

router.post("/", verificarToken, validarParadoja, verificarValidaciones, paradojaControllers.crear);
router.get("/", paradojaControllers.listar);
router.get("/:id", paradojaControllers.detalle);

module.exports = router;