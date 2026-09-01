import Usuario from "../../models/Usuario.model.js";
import sequelize from "../../config/database.js";
import { generarHash } from "../../utils/utils.js";

const registroUsuario = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    let { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      await t.rollback();

      return res.status(400).json({
        status: "fail",
        message:
          "No se proprocionan los campos requeridos para crear el usuario. Debe proporcionar los siguientes campos: [nombre, email, password]",
      });
    }

    //BUSCAR Y/O CREAR EL USUARIO

    email = email.toLowerCase().trim();

    //SE ENVÍA A GENERAR HASH CON BCRYPT
    let passwordHash = await generarHash(password);

    const [usuario, created] = await Usuario.findOrCreate({
      where: { email },
      defaults: {
        nombre,
        email,
        password: passwordHash,
      },
      transaction: t,
    });

    if (!created) {
      await t.rollback();
      return res.status(400).json({
        status: "fail",
        message:
          "El email utilizado ya existe en la base de datos, intente recuperar su contraseña o debe ponerse en contacto con soporte: soporte@correo.cl",
      });
    }

    await t.commit();
    res.status(201).json({
      status: "Ok",
      message: `Usuario creado con éxito con id: ${usuario.id}`,
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ status: "error", message: error.message });
  }
};

export default registroUsuario;
