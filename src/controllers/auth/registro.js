import * as authService from "../../services/auth.service.js";

const registroUsuario = async (req, res) => {
  try {
    let { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({
        status: "fail",
        message:
          "Debe proporcionar los siguientes campos: [nombre, email, password]",
        data: null,
      });
    }

    email = email.toLowerCase().trim();

    const usuario = await authService.registrar({ nombre, email, password });

    if (!usuario) {
      return res.status(400).json({
        status: "fail",
        message:
          "El email utilizado ya existe en la base de datos. Intente recuperar su contraseña o contacte a soporte: soporte@correo.cl",
        data: null,
      });
    }

    // se arma el objeto a mano: el registro completo trae el password hasheado
    res.status(201).json({
      status: "success",
      message: `Usuario creado con éxito con id: ${usuario.id}`,
      data: {
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

export default registroUsuario;