import * as publicacionesService from "../../services/publicaciones.service.js";

const getPublicaciones = async (req, res) => {
  try {
    const { search, usuarioId } = req.query;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const offset = req.query.offset ? Number(req.query.offset) : undefined;

    const { count, rows } = await publicacionesService.findAll({
      search,
      usuarioId,
      limit,
      offset,
    });

    res.status(200).json({
      status: "success",
      message: "Publicaciones obtenidas con éxito.",
      data: { total: count, publicaciones: rows },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message, data: null });
  }
};

export default getPublicaciones;