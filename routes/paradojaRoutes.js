const express = require("express");
const { body } = require("express-validator");
const paradojaControllers = require("../controllers/paradojaControllers");
const { verificarValidaciones } = require("../middlewares/validaciones");
const verificarToken = require("../middlewares/verificarToken");
const autorizar = require("../middlewares/autorizar");

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

/**
 * @swagger
 * /api/paradojas:
 *   post:
 *     summary: Crear una nueva paradoja (requiere login)
 *     tags: [Paradojas]
 *     responses:
 *       201:
 *         description: Paradoja creada correctamente
 */
router.post("/", verificarToken, validarParadoja, verificarValidaciones, paradojaControllers.crear);

/**
 * @swagger
 * /api/paradojas:
 *   get:
 *     summary: Listar todas las paradojas
 *     tags: [Paradojas]
 *     responses:
 *       200:
 *         description: Lista de paradojas con su chaos_index
 */
router.get("/", paradojaControllers.listar);

/**
 * @swagger
 * /api/paradojas/{id}:
 *   get:
 *     summary: Obtener el detalle de una paradoja
 *     tags: [Paradojas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalle de la paradoja
 *       404:
 *         description: Paradoja no encontrada
 */
router.get("/:id", paradojaControllers.detalle);

/**
 * @swagger
 * /api/paradojas/{id}:
 *   put:
 *     summary: Actualizar una paradoja (requiere login)
 *     tags: [Paradojas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paradoja actualizada
 *       404:
 *         description: Paradoja no encontrada
 */
router.put("/:id", verificarToken, paradojaControllers.actualizar);

/**
 * @swagger
 * /api/paradojas/{id}:
 *   delete:
 *     summary: Eliminar una paradoja (requiere rol admin)
 *     tags: [Paradojas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paradoja eliminada correctamente
 *       403:
 *         description: No tienes permiso para hacer esto
 */
router.delete("/:id", verificarToken, autorizar(["admin"]), paradojaControllers.eliminar);

module.exports = router;