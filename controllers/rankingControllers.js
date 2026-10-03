const rankingService = require("../services/rankingService");
const asyncHandler = require("../utils/asyncHandler");
 
const obtener = asyncHandler(async (req, res) => {
  const ranking = await rankingService.obtenerRanking();
  res.status(200).json(ranking);
});
 
module.exports = { obtener };