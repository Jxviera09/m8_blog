import jwt from "jsonwebtoken";
import Usuario from "../../models/Usuario.model.js";
import { compararHash } from "../../utils/utils.js";

const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Debe proporcionar los campos: [email, password]",
        data: null,
      });
    }

    email = email.toLowerCase().trim();
    const usuario = await Usuario.findOne({ where: { email } });

    // se evalúa el usuario ANTES de tocar usuario.password
    if (!usuario || !(await compararHash(password, usuario.password))) {
      return res.status(401).json({
        status: "fail",
        message: "Autenticación fallida: email y/o password incorrectos.",
        data: null,
      });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, admin: usuario.admin },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    res.status(200).json({
      status: "success",
      message: "Usuario autenticado con éxito.",
      data: {
        token,
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
        },
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: error.message, data: null });
  }
};

export default login;
