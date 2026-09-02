import Usuario from "../models/Usuario.model.js";

// el password nunca sale en las respuestas: se filtra desde el servicio
const CAMPOS_PUBLICOS = ["id", "nombre", "email", "avatar"];
const CAMPOS_PERFIL = ["id", "nombre", "email", "admin", "avatar"];
const OPCIONES_ORDEN = ["id", "nombre", "email"];

export const findAll = async ({ offset, limit, sortBy, direction } = {}) => {
  const order = [];

  if (sortBy && OPCIONES_ORDEN.includes(sortBy)) {
    const dir =
      direction && direction.toLowerCase().trim() === "desc" ? "DESC" : "ASC";
    order.push([sortBy, dir]);
  }

  return Usuario.findAndCountAll({
    attributes: CAMPOS_PUBLICOS,
    offset,
    limit,
    order,
  });
};

export const findById = async (id) =>
  Usuario.findByPk(id, { attributes: CAMPOS_PUBLICOS });

export const findPerfil = async (id) =>
  Usuario.findByPk(id, { attributes: CAMPOS_PERFIL });

// sin filtrar attributes: para guardar se necesita el registro completo
export const findParaEditar = async (id) => Usuario.findByPk(id);

export const actualizarAvatar = async (usuario, ruta) => {
  usuario.avatar = ruta;
  return usuario.save();
};