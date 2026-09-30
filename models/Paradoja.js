const mongoose = require("mongoose");

const capaSchema = new mongoose.Schema({
  pregunta: {
    type: String,
    required: [true, "La pregunta de la capa es obligatoria"],
    trim: true,
  },
  profundidad: {
    type: Number,
    required: true,
  },
  resolution_score: {
    type: Number,
    default: 0,
  },
});

const paradojaSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, "El título es obligatorio"],
      trim: true,
    },
    statement: {
      type: String,
      required: [true, "El statement es obligatorio"],
      maxlength: [300, "El statement no puede superar 300 caracteres"],
      trim: true,
    },
    categoria: {
      type: String,
      enum: {
        values: ["Tiempo", "Espacio", "Identidad", "Conocimiento", "Etica", "Realidad"],
        message: "Categoría inválida",
      },
      required: [true, "La categoría es obligatoria"],
    },
    creador_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    estado: {
      type: String,
      enum: ["Draft", "Active", "Resolved", "Frozen"],
      default: "Draft",
    },
    capas: {
      type: [capaSchema],
      validate: {
        validator: function (capasArray) {
          return capasArray.length >= 2;
        },
        message: "Una paradoja debe tener al menos 2 capas",
      },
    },
    intentos: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Paradoja", paradojaSchema);