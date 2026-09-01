import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";
import Usuario from "./Usuario.model.js";
import Publicacion from "./Publicacion.model.js";

class Comentario extends Model {}

Comentario.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    publicacionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "publicacion_id",
      references: {
        model: Publicacion,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "usuario_id",
      references: {
        model: Usuario,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    contenido: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "El contenido del comentario no puede estar vacío.",
        },
      },
    },
  },
  {
    sequelize,
    modelName: "comentario",
    tableName: "comentarios",
    freezeTableName: true,
    timestamps: true,
    createdAt: "fecha_creacion",
    updatedAt: "fecha_actualizacion",
    underscored: true,
  },
);

export default Comentario;
