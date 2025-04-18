import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/database";

export class Message extends Model {}

Message.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    text: {
      type: DataTypes.STRING(256),
      allowNull: false,
      validate: {
        len: [1, 256],
      },
    },
  },
  {
    sequelize,
  }
);