const express = require("express");
const { body } = require("express-validator");
const authControllers = require("../controllers/authControllers");
const { verificarValidaciones } = require("../middlewares/validaciones");

const router = express.Router();

const validarRegistro = [
  body("username").notEmpty().withMessage("El usuario es obligatorio"),
  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .isLength({ min: 4 })
    .withMessage("La contraseña debe tener al menos 4 caracteres"),
  body("escuela").notEmpty().withMessage("La escuela filosófica es obligatoria"),
];

const validarLogin = [
  body("username").notEmpty().withMessage("El usuario es obligatorio"),
  body("password").notEmpty().withMessage("La contraseña es obligatoria"),
];

router.post("/registro", validarRegistro, verificarValidaciones, authControllers.registrar);
router.post("/login", validarLogin, verificarValidaciones, authControllers.login);

module.exports = router;