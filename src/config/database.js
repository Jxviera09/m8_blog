import { Sequelize } from "sequelize";

//MOTOR_BASE_DATOS://NOMBRE_USUARIO:PASSWORD@DIRECCION_HOST:PUERTO/NOMBRE_BASE_DATOS

const URI_DATABASE =
  "postgres://postgres:TU_PASSWORD@localhost:5432/m8_blog_54_3_g2";

const sequelize = new Sequelize(URI_DATABASE);

export default sequelize;
