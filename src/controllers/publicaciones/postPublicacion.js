import Usuario from "../../models/Usuario.model.js";
import sequelize from "../../config/database.js";
import Publicacion from "../../models/Publicacion.model.js";

const crearPublicacion = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    // el autor sale del token, no del body: así nadie publica haciéndose pasar por otro
    const usuarioId = req.usuario.id;
    let { titulo, contenido } = req.body;

    if (!titulo || !contenido) {
      await t.rollback();

      return res.status(400).json({
        status: "fail",
        message: "Debe proporcionar los siguientes campos: [titulo, contenido]",
        data: null,
      });
    }

    //VALIDAR SI USUARIO EXISTE
    const usuario = await Usuario.findByPk(usuarioId, { transaction: t });

    if (!usuario) {
      await t.rollback();
      return res.status(404).json({
        status: "fail",
        message: "No existe un usuario registrado con el id: " + usuarioId,
        data: null,
      });
    }

    //CREAR PUBLICACION

    const publicacion = await Publicacion.create(
      { usuarioId, titulo, contenido },
      { transaction: t },
    );

    await t.commit();
    res.status(201).json({
      status: "success",
      message: `Publicación creada con éxito con id: ${publicacion.id}`,
      data: { publicacion },
    });
  } catch (error) {
    await t.rollback();
    res
      .status(500)
      .json({ status: "error", message: error.message, data: null });
  }
};

export default crearPublicacion;
