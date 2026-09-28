const respuestaService = require("../services/Respuestaservice");
const asyncHandler = require("../utils/asyncHandler");
 
const crear = asyncHandler(async (req, res) => {
  const respuesta = await respuestaService.crearRespuesta({
    capa: req.body.capa,
    tipo: req.body.tipo,
    contenido: req.body.contenido,
    respuestaPadre: req.body.respuestaPadre,
    autor: req.usuario.id,
  });
 
  res.status(201).json({
    mensaje: "Respuesta creada correctamente",
    respuesta: respuesta,
  });
});
 
const listarPorCapa = asyncHandler(async (req, res) => {
  const respuestas = await respuestaService.listarPorCapa(req.params.capaId);
 
  res.status(200).json({
    total: respuestas.length,
    respuestas: respuestas,
  });
});
 
module.exports = { crear, listarPorCapa };