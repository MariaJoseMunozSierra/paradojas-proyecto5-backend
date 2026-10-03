require("dotenv").config();
const mongoose = require("mongoose");
const Usuario = require("../models/Usuario");
const Paradoja = require("../models/Paradoja");
const Respuesta = require("../models/Respuesta");
const Voto = require("../models/Voto");
const Duelo = require("../models/Duelo");
 
async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Conectado a MongoDB para el seed");
 
  const usuarios = await Usuario.find();
  const paradojas = await Paradoja.find();
 
  if (usuarios.length === 0 || paradojas.length === 0) {
    console.error("No hay usuarios o paradojas. Corre primero el seed de usuarios y paradojas.");
    process.exit(1);
  }
 
 
  await Respuesta.deleteMany({});
  await Voto.deleteMany({});
  await Duelo.deleteMany({});
 
  const tipos = ["resolve", "complicate"];
  const contenidos = [
    "Creo que la respuesta depende de cómo definamos identidad.",
    "Esto no resuelve nada, abre una pregunta más profunda aún.",
    "Si aceptamos esta premisa, el resto se vuelve inconsistente.",
    "La solución está en distinguir entre apariencia y esencia.",
    "No hay forma de responder esto sin caer en una petición de principio.",
  ];
 
  const respuestasCreadas = [];
 
  
  for (let i = 0; i < 30; i++) {
    const paradoja = paradojas[i % paradojas.length];
    const capa = paradoja.capas[i % paradoja.capas.length];
    const autor = usuarios[i % usuarios.length];
    const tipo = tipos[i % tipos.length];
    const contenido = contenidos[i % contenidos.length];
 
    const respuesta = await Respuesta.create({
      paradoja: paradoja._id,
      capa: capa._id,
      autor: autor._id,
      tipo,
      contenido,
    });
 
    respuestasCreadas.push(respuesta);
 
    paradoja.intentos += 1;
    await paradoja.save();
  }
 
  
  const respuestasResolve = respuestasCreadas.filter((r) => r.tipo === "resolve");
  const valoresVoto = ["agree", "disagree", "abstain"];
  let votosCreados = 0;
  let intento = 0;
 
  while (votosCreados < 15 && respuestasResolve.length > 0) {
    const respuesta = respuestasResolve[intento % respuestasResolve.length];
    const usuario = usuarios[(intento + 1) % usuarios.length];
 
    const yaVoto = await Voto.findOne({ usuario: usuario._id, respuesta: respuesta._id });
    if (!yaVoto) {
      await Voto.create({
        usuario: usuario._id,
        respuesta: respuesta._id,
        valor: valoresVoto[intento % valoresVoto.length],
      });
      votosCreados++;
    }
    intento++;
 
    if (intento > 200) break; 
  }
 
  for (let i = 0; i < 3; i++) {
    const paradoja = paradojas[i % paradojas.length];
    const retador = usuarios[i % usuarios.length];
    const retado = usuarios[(i + 1) % usuarios.length];
 
    await Duelo.create({
      paradoja: paradoja._id,
      retador: retador._id,
      retado: retado._id,
      estado: i === 0 ? "Aceptado" : "Pendiente",
    });
  }
 
  console.log(`Seed completo: ${respuestasCreadas.length} respuestas, ${votosCreados} votos, 3 duelos`);
  await mongoose.disconnect();
  process.exit(0);
}
 
seed().catch((err) => {
  console.error("Error en el seed:", err);
  process.exit(1);
});