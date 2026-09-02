import * as publicacionesService from "../../services/publicaciones.service.js";

const getPublicacionById = async (req, res) => {
  try {
    const { id } = req.params;
    const publicacion = await publicacionesService.findById(id);

    if (!publicacion) {
      return res.status(404).json({
        status: "fail",
        message: "No existe ninguna publicación con id: " + id,
        data: null,
      });
    }

    res.status(200).json({
      status: "success",
      message: "Publicación obtenida con éxito.",
      data: { publicacion },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message, data: null });
  }
};

export default getPublicacionById;