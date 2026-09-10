export const generarPasswordAleatoria = (longitud = 10) => {
  const caracteres =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";

  const valores = new Uint32Array(longitud);
  crypto.getRandomValues(valores);

  return Array.from(valores, (valor) =>
    caracteres[valor % caracteres.length]
  ).join("");
};
