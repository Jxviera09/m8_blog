import * as usuariosService from "../../services/usuarios.service.js";

const getUsuarios = async (req, res) => {
  try {
    const { sortBy, direction } = req.query;
    const offset = req.query.offset ? Number(req.query.offset) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;

    const { count, rows } = await usuariosService.findAll({
      offset,
      limit,
      sortBy,
      direction,
    });

    res.status(200).json({
      status: "success",
      message: "Usuarios obtenidos con éxito.",
      data: { total: count, usuarios: rows },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message, data: null });
  }
};

export default getUsuarios;