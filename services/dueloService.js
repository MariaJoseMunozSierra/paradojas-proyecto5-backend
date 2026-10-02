const Duelo = require("../models/Duelo");
const Paradoja = require("../models/Paradoja");
const Usuario = require("../models/Usuario");
 
async function crearDuelo({ paradoja, retador, retado }) {
  if (String(retador) === String(retado)) {
    throw { status: 400, message: "No puedes retarte a ti mismo" };
  }
 
  const paradojaExistente = await Paradoja.findById(paradoja);
  if (!paradojaExistente) {
    throw { status: 404, message: "La paradoja no existe" };
  }
 
  const usuarioRetado = await Usuario.findById(retado);
  if (!usuarioRetado) {
    throw { status: 404, message: "El usuario retado no existe" };
  }
 
  const dueloExistente = await Duelo.findOne({
    paradoja,
    retador,
    retado,
    estado: "Pendiente",
  });
  if (dueloExistente) {
    throw { status: 400, message: "Ya existe un duelo pendiente entre estos usuarios para esta paradoja" };
  }
 
  const nuevoDuelo = await Duelo.create({ paradoja, retador, retado });
 
  return await nuevoDuelo.populate([
    { path: "retador", select: "username escuela" },
    { path: "retado", select: "username escuela" },
    { path: "paradoja", select: "titulo categoria estado" },
  ]);
}
 
async function responderDuelo({ dueloId, usuarioId, aceptar }) {
  const duelo = await Duelo.findById(dueloId);
  if (!duelo) {
    throw { status: 404, message: "El duelo no existe" };
  }
 
  if (String(duelo.retado) !== String(usuarioId)) {
    throw { status: 403, message: "Solo el usuario retado puede responder este duelo" };
  }
 
  if (duelo.estado !== "Pendiente") {
    throw { status: 400, message: "Este duelo ya fue respondido" };
  }
 
  duelo.estado = aceptar ? "Aceptado" : "Rechazado";
  await duelo.save();
 
  return duelo;
}
 
async function finalizarDuelo({ dueloId, ganadorId }) {
  const duelo = await Duelo.findById(dueloId);
  if (!duelo) {
    throw { status: 404, message: "El duelo no existe" };
  }
 
  if (duelo.estado !== "Aceptado") {
    throw { status: 400, message: "El duelo debe estar aceptado antes de finalizarlo" };
  }
 
  const participantes = [String(duelo.retador), String(duelo.retado)];
  if (!participantes.includes(String(ganadorId))) {
    throw { status: 400, message: "El ganador debe ser uno de los participantes del duelo" };
  }
 
  duelo.ganador = ganadorId;
  duelo.estado = "Terminado";
  await duelo.save();
 
  return duelo;
}
 
async function listarPorUsuario(usuarioId) {
  const duelos = await Duelo.find({
    $or: [{ retador: usuarioId }, { retado: usuarioId }],
  })
    .populate("retador", "username escuela")
    .populate("retado", "username escuela")
    .populate("paradoja", "titulo categoria estado")
    .sort({ createdAt: -1 });
 
  return duelos;
}
 
module.exports = { crearDuelo, responderDuelo, finalizarDuelo, listarPorUsuario };