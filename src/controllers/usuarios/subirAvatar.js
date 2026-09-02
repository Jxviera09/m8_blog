import * as usuariosService from "../../services/usuarios.service.js";

const subirAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: "fail",
        message:
          "No se recibió ningún archivo. Envíe el campo 'avatar' como form-data.",
        data: null,
      });
    }

    // el usuario sale del token: cada quien sube su propia foto
    const usuario = await usuariosService.findParaEditar(req.usuario.id);

    if (!usuario) {
      return res.status(404).json({
        status: "fail",
        message: "El usuario asociado al token ya no existe.",
        data: null,
      });
    }

    const actualizado = await usuariosService.actualizarAvatar(
      usuario,
      `/uploads/${req.file.filename}`,
    );

    res.status(200).json({
      status: "success",
      message: "Avatar actualizado con éxito.",
      data: {
        id: actualizado.id,
        nombre: actualizado.nombre,
        avatar: actualizado.avatar,
        archivo: {
          nombreOriginal: req.file.originalname,
          tipo: req.file.mimetype,
          tamanoBytes: req.file.size,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message, data: null });
  }
};

export default subirAvatar;