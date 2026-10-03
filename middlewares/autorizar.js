function autorizar(rolesPermitidos) {
  return function (req, res, next) {
    if (!req.usuarioRole) {
      return res.status(401).json({ error: "No se pudo verificar tu rol" });
    }

    const tieneAcceso = rolesPermitidos.includes(req.usuarioRole);

    if (!tieneAcceso) {
      return res.status(403).json({ error: "No tienes permiso para hacer esto" });
    }

    next();
  };
}

module.exports = autorizar;