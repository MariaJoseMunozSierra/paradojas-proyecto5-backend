const Paradoja = require("../models/Paradoja");
const chaosService = require("./chaosService");

async function crearParadoja(datos) {
  if (!datos.capas || datos.capas.length < 2) {
    throw { status: 400, message: "Se necesitan al menos 2 capas" };
  }

  const nuevaParadoja = new Paradoja(datos);
  await nuevaParadoja.save();
  return nuevaParadoja;
}

async function listarParadojas() {
  const paradojas = await Paradoja.find();
  return paradojas;
}

async function obtenerParadojaPorId(id) {
  const paradoja = await Paradoja.findById(id);
  if (!paradoja) {
    throw { status: 404, message: "Paradoja no encontrada" };
  }
  return paradoja;
}

module.exports = {
  crearParadoja,
  listarParadojas,
  obtenerParadojaPorId,
  calcularChaosIndex: chaosService.calcularChaosIndex,
};