import fs from "node:fs";
import path from "node:path";

const LOG_DIR = "logs";
const LOG_FILE = path.join(LOG_DIR, "access.log");

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

const logger = (req, res, next) => {
  // se registra al terminar la respuesta, para poder incluir el código de estado
  res.on("finish", () => {
    const usuario = req.usuario ? `usuario:${req.usuario.id}` : "anonimo";
    const linea = `${new Date().toISOString()} | ${req.method} ${req.originalUrl} | ${res.statusCode} | ${usuario}\n`;

    // appendFile asíncrono: no bloquea la respuesta que ya se envió
    fs.appendFile(LOG_FILE, linea, (error) => {
      if (error) console.error("No se pudo escribir el log:", error.message);
    });
  });

  next();
};

export default logger;
