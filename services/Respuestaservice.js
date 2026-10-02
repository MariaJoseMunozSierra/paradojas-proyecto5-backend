const Respuesta = require("../models/Respuesta");
const Paradoja = require("../models/Paradoja");
 
async function crearRespuesta({ capa, autor, tipo, contenido, respuestaPadre }) {
  const paradoja = await Paradoja.findOne({ "capas._id": capa });
  if (!paradoja) {
    throw { status: 404, message: "La capa no existe" };
  }
  const capaExistente = paradoja.capas.id(capa);
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
      paradoja: paradoja._id,
    capa: capaExistente._id,
    autor,
    tipo,
    contenido,
    respuestaPadre: respuestaPadre || null,
  });
   paradoja.intentos += 1;
  await paradoja.save();  
  return await nuevaRespuesta.populate("autor", "username escuela");
}
 
async function listarPorCapa(capaId) {
  const respuestas = await Respuesta.find({ capa: capaId })
    .populate("autor", "username escuela")
    .sort({ createdAt: 1 });
 
  return respuestas;
}
 
module.exports = { crearRespuesta, listarPorCapa };