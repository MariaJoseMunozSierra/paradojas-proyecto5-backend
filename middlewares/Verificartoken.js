const jwt = require("jsonwebtoken");

function verificarToken(req, res, next) {
  const encabezadoAuth = req.headers.authorization;

  if (!encabezadoAuth || !encabezadoAuth.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No se envió un token de acceso" });
  }

  const token = encabezadoAuth.split(" ")[1];

  try {
    const datosDecodificados = jwt.verify(token, process.env.JWT_SECRET);
    req.usuarioId = datosDecodificados.id;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}

module.exports = verificarToken;