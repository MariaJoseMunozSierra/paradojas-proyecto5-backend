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

async function actualizarParadoja(id, datosNuevos) {
  const paradoja = await Paradoja.findById(id);
  if (!paradoja) {
    throw { status: 404, message: "Paradoja no encontrada" };
  }

  if (datosNuevos.titulo !== undefined) {
    paradoja.titulo = datosNuevos.titulo;
  }
  if (datosNuevos.statement !== undefined) {
    paradoja.statement = datosNuevos.statement;
  }
  if (datosNuevos.categoria !== undefined) {
    paradoja.categoria = datosNuevos.categoria;
  }
  if (datosNuevos.estado !== undefined) {
    paradoja.estado = datosNuevos.estado;
  }

  await paradoja.save();
  return paradoja;
}

async function eliminarParadoja(id) {
  const paradoja = await Paradoja.findByIdAndDelete(id);
  if (!paradoja) {
    throw { status: 404, message: "Paradoja no encontrada" };
  }
  return paradoja;
}

module.exports = {
  crearParadoja,
  listarParadojas,
  obtenerParadojaPorId,
  actualizarParadoja,
  eliminarParadoja,
  calcularChaosIndex: chaosService.calcularChaosIndex,
};