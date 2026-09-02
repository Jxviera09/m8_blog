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
        message: "Faltan campos",
        data: null,
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
        message: "Email duplicado",
        data: null,
      });
    }

    await t.commit();
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
    await t.rollback();
    res
      .status(500)
      .json({ status: "error", message: error.message, data: null });
  }
};

export default registroUsuario;
