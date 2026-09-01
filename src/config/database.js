import { Sequelize } from "sequelize";

//MOTOR_BASE_DATOS://NOMBRE_USUARIO:PASSWORD@DIRECCION_HOST:PUERTO/NOMBRE_BASE_DATOS

const URI_DATABASE = process.env.PG_URI;

if (!URI_DATABASE) {
  throw new Error(
    "Falta la variable PG_URI. Copie .env.example a .env y complete sus credenciales.",
  );
}

const sequelize = new Sequelize(URI_DATABASE);

export default sequelize;
