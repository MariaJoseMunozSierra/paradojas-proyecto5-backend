const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const usuarioSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "El usuario es obligatorio"],
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
      minlength: [4, "La contraseña debe tener al menos 4 caracteres"],
      select: false,
    },

    escuela: {
      type: String,
      enum: {
        values: ["Esceptico", "Estoico", "Existencialista"],
        message: "La escuela debe ser Esceptico, Estoico o Existencialista",
      },
      required: [true, "La escuela filosófica es obligatoria"],
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },

    paradox_score: {
      type: Number,
      default: 0,
    },

    chaos_index: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

usuarioSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

usuarioSchema.methods.compararPassword = async function (passwordIngresada) {
  const sonIguales = await bcrypt.compare(passwordIngresada, this.password);
  return sonIguales;
};

module.exports = mongoose.model("Usuario", usuarioSchema);