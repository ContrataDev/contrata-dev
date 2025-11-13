import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/database.js";

class JobPosting extends Model {
  static associate(models) {
    JobPosting.belongsTo(models.Project, { foreignKey: "projectId" });
    JobPosting.hasMany(models.Proposal, { foreignKey: "jobPostingId" });
  }
}

JobPosting.init(
  {
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    priceRange: DataTypes.STRING,
    contractType: DataTypes.ENUM("fixed", "hourly"),
    level: DataTypes.ENUM("junior", "pleno", "senior"),
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  {
    sequelize,
    modelName: "JobPosting",
    tableName: "JobPostings",
    timestamps: true,
  }
);

export default JobPosting;
