const Usuario = require("../models/Usuario");
const Paradoja = require("../models/Paradoja");
const Respuesta = require("../models/Respuesta");
 
async function obtenerRanking() {
  const [grandPhilosopher, theCreator, agentOfChaos, theResolver] = await Promise.all([
    grandPhilosopherRanking(),
    theCreatorRanking(),
    agentOfChaosRanking(),
    theResolverRanking(),
  ]);
 
  return { grandPhilosopher, theCreator, agentOfChaos, theResolver };
}
 

async function grandPhilosopherRanking() {
  return await Usuario.find()
    .select("username escuela paradox_score")
    .sort({ paradox_score: -1 })
    .limit(10);
}
 

async function theCreatorRanking() {
  const resultado = await Paradoja.aggregate([
    { $group: { _id: "$creador_id", total: { $sum: 1 } } },
    { $sort: { total: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: "usuarios",
        localField: "_id",
        foreignField: "_id",
        as: "usuario",
      },
    },
    { $unwind: "$usuario" },
    {
      $project: {
        _id: 0,
        usuario: "$usuario.username",
        escuela: "$usuario.escuela",
        paradojasCreadas: "$total",
      },
    },
  ]);
 
  return resultado;
}
 
// Agent of Chaos: usuario cuya paradoja creada tiene el chaos_index más alto.
// NOTA: depende de que el modelo Paradoja tenga el campo "chaos_index"

async function agentOfChaosRanking() {
  const resultado = await Paradoja.find()
    .select("titulo chaos_index creador_id")
    .populate("creador_id", "username escuela")
    .sort({ chaos_index: -1 })
    .limit(10);
 
  return resultado;
}
 

async function theResolverRanking() {
  const resultado = await Respuesta.aggregate([
    { $match: { tipo: "resolve" } },
    {
      $lookup: {
        from: "paradojas",
        localField: "paradoja",
        foreignField: "_id",
        as: "paradojaInfo",
      },
    },
    { $unwind: "$paradojaInfo" },
    { $match: { "paradojaInfo.estado": "Resolved" } },
    {
      $group: {
        _id: { usuario: "$autor", paradoja: "$paradoja" },
      },
    },
    {
      $group: {
        _id: "$_id.usuario",
        paradojasResueltas: { $sum: 1 },
      },
    },
    { $sort: { paradojasResueltas: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: "usuarios",
        localField: "_id",
        foreignField: "_id",
        as: "usuario",
      },
    },
    { $unwind: "$usuario" },
    {
      $project: {
        _id: 0,
        usuario: "$usuario.username",
        escuela: "$usuario.escuela",
        paradojasResueltas: 1,
      },
    },
  ]);
 
  return resultado;
}
 
module.exports = { obtenerRanking };