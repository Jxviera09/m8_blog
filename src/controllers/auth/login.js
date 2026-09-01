import Usuario from "../../models/Usuario.model.js";
import { compararHash } from "../../utils/utils.js";

const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      await t.rollback();

      return res.status(400).json({
        status: "fail",
        message:
          "No se proprocionan los campos requeridos. Debe proporcionar los siguientes campos:[email, password]",
      });
    }

    email = email.toLowerCase().trim();

    //buscar usuario por su correo
    const usuario = await Usuario.findOne({ where: { email } });

    let coincidePassword = await compararHash(password, usuario.password);

    if (!usuario || !coincidePassword) {
      return res.status(400).json({
        status: "fail",
        message: "Autenticación fallida: email y/o password incorrectos.",
      });
    }

    res.status(201).json({
      status: "Ok",
      message: `Usuario autenticado con éxito.`,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export default login;
