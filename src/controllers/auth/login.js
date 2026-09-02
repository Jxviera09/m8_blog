import * as authService from "../../services/auth.service.js";

const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Debe proporcionar los siguientes campos: [email, password]",
        data: null,
      });
    }

    email = email.toLowerCase().trim();

    const usuario = await authService.verificarCredenciales({ email, password });

    // mismo mensaje si el email no existe o si la password está mala:
    // responder distinto permitiría averiguar qué correos están registrados
    if (!usuario) {
      return res.status(401).json({
        status: "fail",
        message: "Autenticación fallida: email y/o password incorrectos.",
        data: null,
      });
    }

    const token = authService.generarToken(usuario);

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
    res.status(500).json({ status: "error", message: error.message, data: null });
  }
};

export default login;