import * as comentariosService from "../../services/comentarios.service.js";

const getComentario = async (req, res) => {
  try {
    // filtro dinámico: si viene ?publicacionId= se acota, si no, devuelve todos
    const { publicacionId } = req.query;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const offset = req.query.offset ? Number(req.query.offset) : undefined;

    const { count, rows } = await comentariosService.findAll({
      publicacionId,
      limit,
      offset,
    });

    res.status(200).json({
      status: "success",
      message: "Comentarios obtenidos con éxito.",
      data: { total: count, comentarios: rows },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message, data: null });
  }
};

export default getComentario;