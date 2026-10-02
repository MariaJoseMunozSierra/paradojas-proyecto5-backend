function calcularChaosIndex(paradoja) {
  if (paradoja.capas.length === 0) {
    return 0;
  }

  let sumaDeScores = 0;
  for (let i = 0; i < paradoja.capas.length; i++) {
    sumaDeScores = sumaDeScores + paradoja.capas[i].resolution_score;
  }

  let promedio = sumaDeScores / paradoja.capas.length;
  let chaosIndex = (paradoja.intentos * 2) + (paradoja.capas.length * 5) - (promedio * 0.5);

  return chaosIndex;
}

module.exports = { calcularChaosIndex };