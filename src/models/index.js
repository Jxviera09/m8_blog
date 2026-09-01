import Usuario from "./Usuario.model.js";
import Publicacion from "./Publicacion.model.js";
import Comentario from "./Comentario.model.js";

//relación 1 a muchos entre Usuarios y Publicaciones
Usuario.hasMany(Publicacion, { foreignKey: "usuarioId", onDelete: "CASCADE" });

Publicacion.belongsTo(Usuario, { foreignKey: "usuarioId" });

// Relaciones con Usuario
Usuario.hasMany(Comentario, { foreignKey: "usuarioId", onDelete: "CASCADE" });
Comentario.belongsTo(Usuario, { foreignKey: "usuarioId" });

// Relaciones con Publicacion
Publicacion.hasMany(Comentario, {
  foreignKey: "publicacionId",
  onDelete: "CASCADE",
});
Comentario.belongsTo(Publicacion, { foreignKey: "publicacionId" });

export default {
  Usuario,
  Publicacion,
  Comentario,
};
