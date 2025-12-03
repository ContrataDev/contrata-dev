// models/Project.js
import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/database.js";

class Project extends Model {
  static associate(models) {
    Project.belongsTo(models.Client, { foreignKey: "clientId" });
    Project.hasMany(models.JobPosting, { foreignKey: "projectId" });
    Project.hasMany(models.Contract, { foreignKey: "projectId" });
  }
}

Project.init(
  {
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    technologies: DataTypes.TEXT,
    budget: DataTypes.FLOAT,
    deadline: DataTypes.DATE,
    status: DataTypes.ENUM(
      "draft",
      "open",
      "in_progress",
      "completed",
      "cancelled"
    ),
    // attachments: DataTypes.ARRAY(DataTypes.STRING),
  },
  {
    sequelize,
    modelName: "Project",
    tableName: "Projects",
    timestamps: true,
  }
);

export default Project;
