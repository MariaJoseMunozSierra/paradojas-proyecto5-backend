function asyncHandler(funcion) {
  return function (req, res, next) {
    Promise.resolve(funcion(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;