const jwt = require("jsonwebtoken");
 
function verificarToken(req, res, next) {
  const header = req.headers.authorization;
 
  if (!header || !header.startsWith("Bearer ")) {
    throw { status: 401, message: "Token no proporcionado" };
  }
 
  const token = header.split(" ")[1];
 
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw { status: 401, message: "Token inválido o expirado" };
  }
 
  // El payload trae { id, username } (ver generarToken en authService)
  req.usuario = payload;
  next();
}
 
module.exports = verificarToken;