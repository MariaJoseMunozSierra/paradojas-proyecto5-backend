const paradojaService = require("../services/paradojaService");
const asyncHandler = require("../utils/asyncHandler");

const crear = asyncHandler(async (req, res) => {
  const nuevaParadoja = await paradojaService.crearParadoja(req.body);
  res.status(201).json(nuevaParadoja);
});

const listar = asyncHandler(async (req, res) => {
  const paradojas = await paradojaService.listarParadojas();

  const paradojasConChaosIndex = [];
  for (let i = 0; i < paradojas.length; i++) {
    let unaParadoja = paradojas[i].toObject();
    unaParadoja.chaos_index = paradojaService.calcularChaosIndex(paradojas[i]);
    paradojasConChaosIndex.push(unaParadoja);
  }

  res.status(200).json(paradojasConChaosIndex);
});

const detalle = asyncHandler(async (req, res) => {
  const paradoja = await paradojaService.obtenerParadojaPorId(req.params.id);
  const paradojaConChaosIndex = paradoja.toObject();
  paradojaConChaosIndex.chaos_index = paradojaService.calcularChaosIndex(paradoja);
  res.status(200).json(paradojaConChaosIndex);
});

module.exports = { crear, listar, detalle };