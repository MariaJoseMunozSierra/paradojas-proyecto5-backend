const mongoose = require("mongoose");
const Respuesta = require("../models/Respuesta");
 
async function crearRespuesta({ capa, autor, tipo, contenido, respuestaPadre }) {
  // Se obtiene el modelo Capa al momento de usarlo (se crea en el commit 3)
  const Capa = mongoose.model("Capa");
 
  const capaExistente = await Capa.findById(capa);
  if (!capaExistente) {
    throw { status: 404, message: "La capa no existe" };
  }
 
  if (respuestaPadre) {
    const padre = await Respuesta.findById(respuestaPadre);
    if (!padre) {
      throw { status: 404, message: "La respuesta a la que respondes no existe" };
    }
    if (String(padre.capa) !== String(capaExistente._id)) {
      throw { status: 400, message: "La respuesta padre pertenece a otra capa" };
    }
  }
 
  const nuevaRespuesta = await Respuesta.create({
    paradoja: capaExistente.paradoja,
    capa: capaExistente._id,
    autor,
    tipo,
    contenido,
    respuestaPadre: respuestaPadre || null,
  });
 
  return await nuevaRespuesta.populate("autor", "username escuela");
}
 
async function listarPorCapa(capaId) {
  const respuestas = await Respuesta.find({ capa: capaId })
    .populate("autor", "username escuela")
    .sort({ createdAt: 1 });
 
  return respuestas;
}
 
module.exports = { crearRespuesta, listarPorCapa };