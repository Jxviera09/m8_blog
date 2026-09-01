import Usuario from "../../models/Usuario.model.js";

const getUsuarios = async (req, res) => {
  try {
    let { offset, limit, sortBy, direction } = req.query;

    if (offset) {
      offset = Number(offset);
    }

    if (limit) {
      limit = Number(limit);
    }

    const opcionesOrden = ["id", "nombre", "email"];
    const order = [];

    if (sortBy && opcionesOrden.includes(sortBy)) {
      sortBy = sortBy.toLowerCase().trim();

      let orden;
      if (direction && direction.toLowerCase().trim() == "desc") {
        orden = [sortBy, "DESC"];
      } else {
        orden = [sortBy, "ASC"];
      }

      order.push(orden);
    }

    const { count, rows } = await Usuario.findAndCountAll({
      attributes: ["id", "nombre", "email"],
      offset: isNaN(offset) ? undefined : offset,
      limit: isNaN(limit) ? undefined : limit,
      order,
    });

    res.json({
      status: "Ok",
      totalUsuariosDb: count,
      usuarios: rows,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export default getUsuarios;
