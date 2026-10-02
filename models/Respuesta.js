const mongoose = require("mongoose");
 
const respuestaSchema = new mongoose.Schema(
  {
    paradoja: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Paradoja",
      required: [true, "La paradoja es obligatoria"],
    },
 
    capa: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "La capa es obligatoria"],
    },
 
    autor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: [true, "El autor es obligatorio"],
    },
 
    tipo: {
      type: String,
      enum: {
        values: ["resolve", "complicate"],
        message: "El tipo debe ser resolve o complicate",
      },
      required: [true, "El tipo de respuesta es obligatorio"],
    },
 
    contenido: {
      type: String,
      required: [true, "El contenido es obligatorio"],
      trim: true,
      maxlength: [1000, "El contenido no puede superar 1000 caracteres"],
    },
 
    // Permite responder a otra respuesta (estructura de grafo/árbol del debate)
    respuestaPadre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Respuesta",
      default: null,
    },
  },
  { timestamps: true }
);
 
respuestaSchema.index({ capa: 1, createdAt: 1 });
 
module.exports = mongoose.model("Respuesta", respuestaSchema);