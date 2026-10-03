const mongoose = require("mongoose");
 
const votoSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: [true, "El usuario es obligatorio"],
    },
 
    respuesta: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Respuesta",
      required: [true, "La respuesta es obligatoria"],
    },
 
    valor: {
      type: String,
      enum: {
        values: ["agree", "disagree", "abstain"],
        message: "El voto debe ser agree, disagree o abstain",
      },
      required: [true, "El valor del voto es obligatorio"],
    },
  },
  { timestamps: true }
);
 
// Un usuario solo puede votar una vez por respuesta
votoSchema.index({ usuario: 1, respuesta: 1 }, { unique: true });
 
module.exports = mongoose.model("Voto", votoSchema);