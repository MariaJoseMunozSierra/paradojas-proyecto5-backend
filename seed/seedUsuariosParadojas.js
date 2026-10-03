require("dotenv").config();
const mongoose = require("mongoose");
const Usuario = require("../models/Usuario");
const Paradoja = require("../models/Paradoja");

const escuelas = ["Esceptico", "Estoico", "Existencialista"];

async function crearUsuarios() {
  const usuariosCreados = [];

  for (let i = 0; i < escuelas.length; i++) {
    const escuela = escuelas[i];

    for (let j = 1; j <= 4; j++) {
      const nuevoUsuario = new Usuario({
        username: escuela.toLowerCase() + "_" + j,
        password: "password123",
        escuela: escuela,
      });
      await nuevoUsuario.save();
      usuariosCreados.push(nuevoUsuario);
    }
  }

  return usuariosCreados;
}

async function crearParadojas(usuarios) {
  const datosDeParadojas = [
    {
      titulo: "El dilema del tranvía",
      statement: "Un tranvía va a matar a 5 personas. Puedes desviarlo y matar solo a 1. ¿Es correcto actuar?",
      categoria: "Etica",
      estado: "Active",
      capas: [
        { pregunta: "¿Es lo mismo actuar que dejar que algo pase?", profundidad: 1 },
        { pregunta: "¿El número de vidas justifica la decisión?", profundidad: 2 },
      ],
    },
    {
      titulo: "La paradoja del abuelo",
      statement: "Si viajas al pasado y evitas que tus abuelos se conozcan, ¿cómo puedes existir para viajar en el tiempo?",
      categoria: "Tiempo",
      estado: "Active",
      capas: [
        { pregunta: "¿Se puede alterar el pasado sin contradicción?", profundidad: 1 },
        { pregunta: "¿Existen líneas de tiempo paralelas?", profundidad: 2 },
      ],
    },
    {
      titulo: "Aquiles y la tortuga",
      statement: "Aquiles nunca alcanza a la tortuga si esta siempre avanza un poco más antes de que él llegue a su posición anterior.",
      categoria: "Espacio",
      estado: "Draft",
      capas: [
        { pregunta: "¿El espacio se puede dividir infinitamente?", profundidad: 1 },
        { pregunta: "¿Cómo se relaciona esto con el movimiento real?", profundidad: 2 },
      ],
    },
    {
      titulo: "La paradoja de la profecía",
      statement: "Si sabes con certeza que algo va a pasar, ¿sigue siendo libre tu decisión de actuar?",
      categoria: "Conocimiento",
      estado: "Draft",
      capas: [
        { pregunta: "¿El conocimiento del futuro elimina el libre albedrío?", profundidad: 1 },
        { pregunta: "¿Puede una predicción ser cierta y evitable a la vez?", profundidad: 2 },
      ],
    },
    {
      titulo: "El argumento del sueño de Descartes",
      statement: "¿Cómo sabes que no estás soñando en este momento?",
      categoria: "Realidad",
      estado: "Draft",
      capas: [
        { pregunta: "¿Existe una diferencia real entre soñar y estar despierto?", profundidad: 1 },
        { pregunta: "¿Qué evidencia distingue la realidad de la ilusión?", profundidad: 2 },
      ],
    },
    {
      titulo: "La paradoja de los gemelos idénticos",
      statement: "Si dos personas comparten el 100% de su ADN, ¿qué hace que sean individuos distintos?",
      categoria: "Identidad",
      estado: "Frozen",
      capas: [
        { pregunta: "¿La identidad depende del cuerpo o de la mente?", profundidad: 1 },
        { pregunta: "¿Qué papel juega la experiencia individual?", profundidad: 2 },
      ],
    },
    {
      titulo: "La paradoja de Newcomb",
      statement: "Te ofrecen dos cajas: una transparente con dinero visible y otra opaca según una predicción sobre tu elección. ¿Es más racional elegir una o las dos?",
      categoria: "Etica",
      estado: "Resolved",
      capas: [
        { pregunta: "¿Puede una predicción perfecta afectar tu decisión libre?", profundidad: 1 },
        { pregunta: "¿Qué estrategia maximiza la ganancia esperada?", profundidad: 2 },
      ],
    },
    {
      titulo: "La paradoja de Monty Hall",
      statement: "En un concurso con 3 puertas, cambiar tu elección después de revelar una puerta vacía duplica tus posibilidades de ganar.",
      categoria: "Conocimiento",
      estado: "Resolved",
      capas: [
        { pregunta: "¿Por qué la probabilidad no es 50/50 tras revelar una puerta?", profundidad: 1 },
        { pregunta: "¿Cómo cambia la información nueva la estrategia óptima?", profundidad: 2 },
      ],
    },
    {
      titulo: "El dilema del prisionero",
      statement: "Dos sospechosos: si ambos cooperan les va mejor que si ambos se traicionan, pero individualmente cada uno gana más traicionando al otro.",
      categoria: "Etica",
      estado: "Active",
      capas: [
        { pregunta: "¿Es racional cooperar si no puedes confiar en el otro?", profundidad: 1 },
        { pregunta: "¿Qué pasa si el juego se repite muchas veces?", profundidad: 2 },
      ],
    },
    {
      titulo: "La nave de Teseo",
      statement: "Si reemplazas todas las piezas de un barco una por una, ¿sigue siendo el mismo barco?",
      categoria: "Identidad",
      estado: "Active",
      capas: [
        { pregunta: "¿La identidad depende de la materia o de la forma?", profundidad: 1 },
        { pregunta: "¿Qué pasa si alguien arma un segundo barco con las piezas originales?", profundidad: 2 },
      ],
    },
  ];

  for (let i = 0; i < datosDeParadojas.length; i++) {
    const datos = datosDeParadojas[i];
    const creador = usuarios[i % usuarios.length];

    const nuevaParadoja = new Paradoja({
      titulo: datos.titulo,
      statement: datos.statement,
      categoria: datos.categoria,
      estado: datos.estado,
      creador_id: creador._id,
      capas: datos.capas,
    });

    await nuevaParadoja.save();
  }
}

async function ejecutarSeed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Conectado a MongoDB para hacer el seed");

  await Usuario.deleteMany({});
  await Paradoja.deleteMany({});
  console.log("Colecciones de Usuario y Paradoja limpiadas");

  const usuarios = await crearUsuarios();
  console.log(usuarios.length + " usuarios creados");

  await crearParadojas(usuarios);
  console.log("10 paradojas creadas");

  console.log("Seed completado con éxito");
  mongoose.connection.close();
}

ejecutarSeed();