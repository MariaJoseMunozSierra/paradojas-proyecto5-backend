const Paradoja = require("../models/Paradoja");

function calcularChaosIndex(paradoja) {
  if (paradoja.capas.length === 0) {
    return 0;
  }

  let sumaDeScores = 0;
  for (let i = 0; i < paradoja.capas.length; i++) {
    sumaDeScores = sumaDeScores + paradoja.capas[i].resolution_score;
  }

  let promedio = sumaDeScores / paradoja.capas.length;
  let chaosIndex = (paradoja.intentos * 2) + (paradoja.capas.length * 5) - (promedio * 0.5);

  return chaosIndex;
}

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
  calcularChaosIndex,
};