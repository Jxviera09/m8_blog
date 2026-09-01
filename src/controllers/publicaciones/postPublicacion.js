import Usuario from "../../models/Usuario.model.js";
import sequelize from "../../config/database.js";
import Publicacion from "../../models/Publicacion.model.js";

const crearPublicacion = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    let { usuarioId, titulo, contenido } = req.body;

    if (!usuarioId || !titulo || !contenido) {
      await t.rollback();

      return res.status(400).json({
        status: "fail",
        message:
          "No se proprocionan los campos requeridos para crear la publicación. Debe proporcionar los siguientes campos: [usuarioId, titulo, contenido]",
      });
    }

    //VALIDAR SI USUARIO EXISTE
    const usuario = await Usuario.findByPk(usuarioId, { transaction: t });

    if (!usuario) {
      await t.rollback();
      return res
        .status(404)
        .json({
          status: "fail",
          message: "No existe un usuario registrado con el id: " + usuarioId,
        });
    }

    //CREAR PUBLICACION

    const publicacion = await Publicacion.create(
      { usuarioId, titulo, contenido },
      { transaction: t },
    );

    await t.commit();
    res.status(201).json({
      status: "Ok",
      message: `Publicación creada con éxito con ID: ${publicacion.id}`,
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ status: "error", message: error.message });
  }
};

export default crearPublicacion;
