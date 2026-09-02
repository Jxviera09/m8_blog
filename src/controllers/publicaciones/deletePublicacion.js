import * as publicacionesService from "../../services/publicaciones.service.js";

const deletePublicacion = async (req, res) => {
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

    if (publicacion.usuarioId !== req.usuario.id) {
      return res.status(403).json({
        status: "fail",
        message: "No tiene permiso para eliminar una publicación de otro usuario.",
        data: null,
      });
    }

    await publicacionesService.remove(publicacion);

    res.status(200).json({
      status: "success",
      message: `Publicación con id ${id} eliminada con éxito.`,
      data: null,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message, data: null });
  }
};

export default deletePublicacion;