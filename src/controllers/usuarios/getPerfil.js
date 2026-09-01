import Usuario from "../../models/Usuario.model.js";

const getPerfil = async (req, res) => {
  try {
    // el id NO viene de la URL: viene del token, así nadie puede pedir el perfil de otro
    const usuario = await Usuario.findByPk(req.usuario.id, {
      attributes: ["id", "nombre", "email", "admin"],
    });

    if (!usuario) {
      return res.status(404).json({
        status: "fail",
        message: "El usuario asociado al token ya no existe.",
        data: null,
      });
    }

    res.status(200).json({
      status: "success",
      message: "Perfil obtenido con éxito.",
      data: { usuario },
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: error.message, data: null });
  }
};

export default getPerfil;
