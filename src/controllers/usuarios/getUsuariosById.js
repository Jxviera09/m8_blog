import * as usuariosService from "../../services/usuarios.service.js";

const getUsuariosById = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await usuariosService.findById(id);

    if (!usuario) {
      return res.status(404).json({
        status: "fail",
        message: "No existe ningún usuario con id: " + id,
        data: null,
      });
    }

    res.status(200).json({
      status: "success",
      message: "Usuario obtenido con éxito.",
      data: { usuario },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message, data: null });
  }
};

export default getUsuariosById;