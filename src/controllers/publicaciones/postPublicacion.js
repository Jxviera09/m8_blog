import * as publicacionesService from "../../services/publicaciones.service.js";

const crearPublicacion = async (req, res) => {
  try {
    // el autor sale del token, no del body: así nadie publica haciéndose pasar por otro
    const usuarioId = req.usuario.id;
    const { titulo, contenido } = req.body;

    if (!titulo || !contenido) {
      return res.status(400).json({
        status: "fail",
        message: "Debe proporcionar los siguientes campos: [titulo, contenido]",
        data: null,
      });
    }

    const publicacion = await publicacionesService.create({
      usuarioId,
      titulo,
      contenido,
    });

    if (!publicacion) {
      return res.status(404).json({
        status: "fail",
        message: "No existe un usuario registrado con el id: " + usuarioId,
        data: null,
      });
    }

    res.status(201).json({
      status: "success",
      message: `Publicación creada con éxito con id: ${publicacion.id}`,
      data: { publicacion },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message, data: null });
  }
};

export default crearPublicacion;