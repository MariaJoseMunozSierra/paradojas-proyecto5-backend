const dueloService = require("../services/dueloService");
const asyncHandler = require("../utils/asyncHandler");
 
const crear = asyncHandler(async (req, res) => {
  const duelo = await dueloService.crearDuelo({
    paradoja: req.body.paradoja,
    retado: req.body.retado,
    retador: req.usuario.id,
  });
 
  res.status(201).json({
    mensaje: "Duelo creado correctamente",
    duelo: duelo,
  });
});
 
const responder = asyncHandler(async (req, res) => {
  const duelo = await dueloService.responderDuelo({
    dueloId: req.params.id,
    usuarioId: req.usuario.id,
    aceptar: req.body.aceptar,
  });
 
  res.status(200).json({
    mensaje: `Duelo ${duelo.estado.toLowerCase()}`,
    duelo: duelo,
  });
});
 
const finalizar = asyncHandler(async (req, res) => {
  const duelo = await dueloService.finalizarDuelo({
    dueloId: req.params.id,
    ganadorId: req.body.ganador,
  });
 
  res.status(200).json({
    mensaje: "Duelo finalizado correctamente",
    duelo: duelo,
  });
});
 
const listarMisDuelos = asyncHandler(async (req, res) => {
  const duelos = await dueloService.listarPorUsuario(req.usuario.id);
 
  res.status(200).json({
    total: duelos.length,
    duelos: duelos,
  });
});
 
module.exports = { crear, responder, finalizar, listarMisDuelos };