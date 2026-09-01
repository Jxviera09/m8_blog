import Publicacion from "../../models/Publicacion.model.js";

const getPublicacionById = async (req, res) => {
  try {
    let { id } = req.params;
    const publicacion = await Publicacion.findByPk(id);

    if (!publicacion) {
      return res
        .status(404)
        .json({
          status: "fail",
          message: "No existe ninguna publicación con id: " + id,
        });
    }

    res.json({
      status: "Ok",
      publicacion,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export default getPublicacionById;
