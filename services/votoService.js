const Voto = require("../models/Voto");
const Respuesta = require("../models/Respuesta");
const Paradoja = require("../models/Paradoja");
const Usuario = require("../models/Usuario");
 

const UMBRAL_PARADOX_SCORE_ALTO = 100;
const PESO_VOTO_ALTO = 1.5;
const PESO_VOTO_NORMAL = 1;
 
const PUNTOS_POR_RESOLVER_CAPA = 10;
const PUNTOS_POR_RESOLVER_PARADOJA = 50;
const UMBRAL_RESOLUCION = 70;
 
async function votar({ respuestaId, usuarioId, valor }) {
  const respuesta = await Respuesta.findById(respuestaId);
  if (!respuesta) {
    throw { status: 404, message: "La respuesta no existe" };
  }
 

  if (respuesta.tipo !== "resolve") {
    throw { status: 400, message: "Solo se puede votar sobre respuestas que proponen una resolución" };
  }
 
  const yaVoto = await Voto.findOne({ usuario: usuarioId, respuesta: respuestaId });
  if (yaVoto) {
    yaVoto.valor = valor;
    await yaVoto.save();
  } else {
    await Voto.create({ usuario: usuarioId, respuesta: respuestaId, valor });
  }
 
  const nuevoScore = await recalcularResolutionScore({
    paradojaId: respuesta.paradoja,
    capaId: respuesta.capa,
  });
 
  return { mensaje: "Voto registrado", resolution_score: nuevoScore };
}
 

async function recalcularResolutionScore({ paradojaId, capaId }) {
  const respuestasResolve = await Respuesta.find({ capa: capaId, tipo: "resolve" });
  const respuestaIds = respuestasResolve.map((r) => r._id);
 
  const votos = await Voto.find({ respuesta: { $in: respuestaIds } }).populate(
    "usuario",
    "paradox_score"
  );
 
  let totalAgree = 0;
  let totalDisagree = 0;
 
  for (const voto of votos) {
    const esAlto = (voto.usuario?.paradox_score || 0) >= UMBRAL_PARADOX_SCORE_ALTO;
    const peso = esAlto ? PESO_VOTO_ALTO : PESO_VOTO_NORMAL;
 
    if (voto.valor === "agree") totalAgree += peso;
    if (voto.valor === "disagree") totalDisagree += peso;
    
  }
 
  const totalVotos = totalAgree + totalDisagree;
  const nuevoScore = totalVotos === 0 ? 0 : Math.round((totalAgree / totalVotos) * 100);
 
  const paradoja = await Paradoja.findById(paradojaId);
  if (!paradoja) {
    throw { status: 404, message: "La paradoja no existe" };
  }
 
  const capa = paradoja.capas.id(capaId);
  const scoreAnterior = capa.resolution_score;
  capa.resolution_score = nuevoScore;
 

  if (scoreAnterior < UMBRAL_RESOLUCION && nuevoScore >= UMBRAL_RESOLUCION) {
    const autoresUnicos = [...new Set(respuestasResolve.map((r) => String(r.autor)))];
    await Usuario.updateMany(
      { _id: { $in: autoresUnicos } },
      { $inc: { paradox_score: PUNTOS_POR_RESOLVER_CAPA } }
    );
  }
 

  const todasResueltas = paradoja.capas.every((c) => c.resolution_score > UMBRAL_RESOLUCION);
  if (todasResueltas && paradoja.estado !== "Resolved") {
    paradoja.estado = "Resolved";
    
    await Usuario.findByIdAndUpdate(paradoja.creador_id, {
      $inc: { paradox_score: PUNTOS_POR_RESOLVER_PARADOJA },
    });
  }
 
  await paradoja.save();
  return capa.resolution_score;
}
 
module.exports = { votar, recalcularResolutionScore };