const mongoose = require("mongoose");
 
const dueloSchema = new mongoose.Schema(
  {
    paradoja: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Paradoja",
      required: [true, "La paradoja es obligatoria"],
    },
 
    retador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: [true, "El retador es obligatorio"],
    },
 
    retado: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: [true, "El retado es obligatorio"],
    },
 
    estado: {
      type: String,
      enum: {
        values: ["Pendiente", "Aceptado", "Rechazado", "Terminado"],
        message: "Estado de duelo inválido",
      },
      default: "Pendiente",
    },
 
    ganador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      default: null,
    },
  },
  { timestamps: true }
);
 
module.exports = mongoose.model("Duelo", dueloSchema);