import Usuario from "../../models/Usuario.model.js";

const getUsuariosById = async (req, res) => {
  try {
    let { id } = req.params;

    const usuario = await Usuario.findByPk(id, {
      attributes: ["id", "nombre", "email"],
    });

    res.json({
      status: "Ok",
      usuario,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export default getUsuariosById;
