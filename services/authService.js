const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");

async function registrar({ username, password, escuela }) {
  const usuarioExistente = await Usuario.findOne({ username: username });
  if (usuarioExistente) {
    throw { status: 400, message: "Ese usuario ya está registrado" };
  }

  const nuevoUsuario = new Usuario({ username, password, escuela });
  await nuevoUsuario.save();

  const token = generarToken(nuevoUsuario);

  return { usuario: nuevoUsuario, token: token };
}

async function login({ username, password }) {
  const usuario = await Usuario.findOne({ username: username }).select("+password");

  if (!usuario) {
    throw { status: 401, message: "Usuario o contraseña incorrectos" };
  }

  const passwordValida = await usuario.compararPassword(password);
  if (!passwordValida) {
    throw { status: 401, message: "Usuario o contraseña incorrectos" };
  }

  const token = generarToken(usuario);

  return { usuario: usuario, token: token };
}

function generarToken(usuario) {
  return jwt.sign(
    { id: usuario._id, username: usuario.username, role: usuario.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
}

module.exports = { registrar, login };