import { Op } from "sequelize";
import Publicacion from "../models/Publicacion.model.js";
import Usuario from "../models/Usuario.model.js";
import sequelize from "../config/database.js";

// whitelist: lo único que el cliente puede modificar. El resto del body se descarta
const CAMPOS_EDITABLES = ["titulo", "contenido"];

export const findAll = async ({ search, usuarioId, limit, offset } = {}) => {
  const where = {};
  if (usuarioId) where.usuarioId = usuarioId;
  if (search) where.titulo = { [Op.iLike]: `%${search}%` };

  return Publicacion.findAndCountAll({
    where,
    attributes: { exclude: ["usuarioId"] },
    include: [{ model: Usuario, attributes: ["id", "nombre", "email"] }],
    limit,
    offset,
  });
};

export const findById = async (id) => Publicacion.findByPk(id);

export const create = async ({ usuarioId, titulo, contenido }) => {
  const t = await sequelize.transaction();
  try {
    const usuario = await Usuario.findByPk(usuarioId, { transaction: t });

    if (!usuario) {
      await t.rollback();
      return null; // el controlador traduce este null a un 404
    }

    const publicacion = await Publicacion.create(
      { usuarioId, titulo, contenido },
      { transaction: t },
    );

    await t.commit();
    return publicacion;
  } catch (error) {
    await t.rollback();
    throw error; // el controlador lo convierte en 500
  }
};

export const update = async (publicacion, data) => {
  for (const campo of CAMPOS_EDITABLES) {
    if (data[campo] !== undefined) publicacion[campo] = data[campo];
  }
  return publicacion.save();
};

export const remove = async (publicacion) => publicacion.destroy();