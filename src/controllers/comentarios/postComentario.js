import sequelize from "../../config/database.js";
import Comentario from "../../models/Comentario.model.js";
import Publicacion from "../../models/Publicacion.model.js";

const postComentario = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    // el autor sale del token, igual que en las publicaciones
    const usuarioId = req.usuario.id;
    const { publicacionId, contenido } = req.body;

    if (!publicacionId || !contenido) {
      await t.rollback();
      return res.status(400).json({
        status: "fail",
        message: "Debe proporcionar los siguientes campos: [publicacionId, contenido]",
        data: null,
      });
    }

    //VALIDAR QUE LA PUBLICACIÓN EXISTA
    const publicacion = await Publicacion.findByPk(publicacionId, { transaction: t });

    if (!publicacion) {
      await t.rollback();
      return res.status(404).json({
        status: "fail",
        message: "No existe ninguna publicación con id: " + publicacionId,
        data: null,
      });
    }

    const comentario = await Comentario.create(
      { publicacionId, usuarioId, contenido },
      { transaction: t },
    );

    await t.commit();
    res.status(201).json({
      status: "success",
      message: `Comentario creado con éxito con id: ${comentario.id}`,
      data: { comentario },
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ status: "error", message: error.message, data: null });
  }
};

export default postComentario;