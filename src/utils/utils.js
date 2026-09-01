import bcrypt from "bcrypt";

export const generarHash = async (password) => {
  const saltRounds = 12;
  const hash = await bcrypt.hash(password, saltRounds);

  return hash;
};

export const compararHash = async (password, hash) => {
  const coincide = await bcrypt.compare(password, hash);

  return coincide;
};
