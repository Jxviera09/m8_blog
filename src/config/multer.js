import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";

const UPLOAD_DIR = "uploads";
const TIPOS_PERMITIDOS = ["image/jpeg", "image/png", "image/webp"];
const TAMANO_MAXIMO = 2 * 1024 * 1024; // 2 MB

// la carpeta está en .gitignore: si alguien clona el repo, hay que crearla
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    // nombre aleatorio: evita colisiones y que el cliente decida la ruta del archivo
    const nombre =
      crypto.randomUUID() + path.extname(file.originalname).toLowerCase();
    cb(null, nombre);
  },
});

const EXTENSIONES_PERMITIDAS = [".jpg", ".jpeg", ".png", ".webp"];

const fileFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();

  // la extensión es obligatoria: nunca se acepta un archivo fuera de la lista
  if (!EXTENSIONES_PERMITIDAS.includes(extension)) {
    return cb(
      new Error("Extensión no permitida. Solo se aceptan JPG, PNG o WEBP."),
    );
  }

  // el mimetype lo declara el cliente: algunos mandan el genérico octet-stream,
  // en ese caso la extensión ya validada es suficiente
  const mimeValido =
    TIPOS_PERMITIDOS.includes(file.mimetype) ||
    file.mimetype === "application/octet-stream";

  if (!mimeValido) {
    return cb(
      new Error(
        "Tipo de archivo no permitido. Solo se aceptan JPG, PNG o WEBP.",
      ),
    );
  }

  cb(null, true);
};

export default multer({
  storage,
  fileFilter,
  limits: { fileSize: TAMANO_MAXIMO },
});