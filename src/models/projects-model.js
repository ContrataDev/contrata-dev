import { DataTypes, Model } from "sequelize";

import sequelize from "../config/database.js";

class ProjectModel extends Model {}
ProjectModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    budget: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "open",
    },
  },
  {
    sequelize,
    modelName: "Project",
    tableName: "Projects",
  }
);

export default ProjectModel;
