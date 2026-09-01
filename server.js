import app from "./src/app.js";
import sequelize from "./src/config/database.js";

import "./src/models/index.js";

const PORT = process.env.SERVER_PORT || 3000;

const main = async () => {
  try {
    await sequelize.sync({ force: false, alter: false });
    console.log("Base de datos conectada...");
    app.listen(PORT, () => {
      console.log("Servidor activo....");
    });
  } catch (error) {
    console.log(error);
  }
};

main();
