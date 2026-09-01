import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "fail",
      message:
        "Token no proporcionado. Use el header: Authorization: Bearer <token>",
      data: null,
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    // si el token es válido, sus datos quedan disponibles para el controlador
    req.usuario = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    // expirado e inválido son problemas distintos para quien consume la API
    const expirado = error.name === "TokenExpiredError";

    return res.status(401).json({
      status: "fail",
      message: expirado
        ? "El token expiró. Vuelva a autenticarse en POST /auth/login."
        : "Token inválido o alterado.",
      data: null,
    });
  }
};

export default verifyToken;
