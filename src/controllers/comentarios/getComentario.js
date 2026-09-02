import Comentario from "../../models/Comentario.model.js";
import Usuario from "../../models/Usuario.model.js";

const getComentario = async (req, res) => {
  try {
    // filtro dinámico: si viene ?publicacionId= se acota, si no, devuelve todos
    const { publicacionId } = req.query;
    const where = {};
    if (publicacionId) where.publicacionId = publicacionId;

    const { count, rows } = await Comentario.findAndCountAll({
      where,
      attributes: { exclude: ["usuarioId"] },
      include: [{ model: Usuario, attributes: ["id", "nombre", "email"] }],
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