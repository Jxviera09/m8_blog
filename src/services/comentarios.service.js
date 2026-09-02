import Comentario from "../models/Comentario.model.js";
import Publicacion from "../models/Publicacion.model.js";
import Usuario from "../models/Usuario.model.js";
import sequelize from "../config/database.js";

const CAMPOS_EDITABLES = ["contenido"];

export const findAll = async ({ publicacionId, limit, offset } = {}) => {
  const where = {};
  if (publicacionId) where.publicacionId = publicacionId;

  return Comentario.findAndCountAll({
    where,
    attributes: { exclude: ["usuarioId"] },
    include: [{ model: Usuario, attributes: ["id", "nombre", "email"] }],
    limit,
    offset,
  });
};

export const findById = async (id) => Comentario.findByPk(id);

export const create = async ({ publicacionId, usuarioId, contenido }) => {
  const t = await sequelize.transaction();
  try {
    const publicacion = await Publicacion.findByPk(publicacionId, {
      transaction: t,
    });

    if (!publicacion) {
      await t.rollback();
      return null; // el controlador lo traduce a 404
    }

    const comentario = await Comentario.create(
      { publicacionId, usuarioId, contenido },
      { transaction: t },
    );

    await t.commit();
    return comentario;
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

export const update = async (comentario, data) => {
  for (const campo of CAMPOS_EDITABLES) {
    if (data[campo] !== undefined) comentario[campo] = data[campo];
  }
  return comentario.save();
};

export const remove = async (comentario) => comentario.destroy();
