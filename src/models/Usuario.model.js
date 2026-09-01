import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Usuario extends Model {}

Usuario.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "El email ingresa no cumple con el formato de email.",
        },
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "usuario",
    tableName: "usuarios",
    freezeTableName: true,
    timestamps: true,
    createdAt: "fecha_creacion",
    updatedAt: "fecha_actualizacion",
    underscored: true,
  },
);

export default Usuario;
