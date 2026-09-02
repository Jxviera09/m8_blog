import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.model.js";
import sequelize from "../config/database.js";
import { generarHash, compararHash } from "../utils/utils.js";

export const registrar = async ({ nombre, email, password }) => {
  const t = await sequelize.transaction();
  try {
    const passwordHash = await generarHash(password);

    const [usuario, created] = await Usuario.findOrCreate({
      where: { email },
      defaults: { nombre, email, password: passwordHash },
      transaction: t,
    });

    if (!created) {
      await t.rollback();
      return null; // email ya registrado: el controlador responde 400
    }

    await t.commit();
    return usuario;
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

export const verificarCredenciales = async ({ email, password }) => {
  const usuario = await Usuario.findOne({ where: { email } });

  // se compara el hash solo después de comprobar que el usuario existe
  if (!usuario || !(await compararHash(password, usuario.password))) return null;

  return usuario;
};

export const generarToken = (usuario) =>
  jwt.sign(
    { id: usuario.id, email: usuario.email, admin: usuario.admin },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN },
  );