const votoService = require("../services/votoService");
const asyncHandler = require("../utils/asyncHandler");
 
const votar = asyncHandler(async (req, res) => {
  const resultado = await votoService.votar({
    respuestaId: req.body.respuesta,
    usuarioId: req.usuario.id,
    valor: req.body.valor,
  });
 
  res.status(200).json(resultado);
});
 
module.exports = { votar };