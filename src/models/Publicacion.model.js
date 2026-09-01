import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";
import Usuario from "./Usuario.model.js";

class Publicacion extends Model {}

Publicacion.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    titulo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "El título no puede estar vacío.",
        },
      },
    },
    contenido: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "El contenido no puede estar vacío.",
        },
      },
    },
  },
  {
    sequelize,
    modelName: "publicacion",
    tableName: "publicaciones",
    freezeTableName: true,
    timestamps: true,
    createdAt: "fecha_creacion",
    updatedAt: "fecha_actualizacion",
    underscored: true,
  },
);

export default Publicacion;
