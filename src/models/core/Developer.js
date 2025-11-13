import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/database.js";

class Developer extends Model {
  static associate(models) {
    Developer.belongsTo(models.User, { foreignKey: "userId" });
    Developer.hasMany(models.Proposal, { foreignKey: "developerId" });
    Developer.hasMany(models.Contract, { foreignKey: "developerId" });
    Developer.hasMany(models.Timesheet, { foreignKey: "developerId" });

    Developer.hasMany(models.TechnologyStack, { foreignKey: "developerId" });
    Developer.hasMany(models.Certification, { foreignKey: "developerId" });
    Developer.hasMany(models.PortfolioItem, { foreignKey: "developerId" });
    Developer.hasOne(models.Availability, { foreignKey: "developerId" });
    Developer.hasOne(models.RateCard, { foreignKey: "developerId" });
  }
}

Developer.init(
  {
    userId: { type: DataTypes.UUID, allowNull: false },
    stack: DataTypes.STRING,
    seniority: DataTypes.ENUM("junior", "pleno", "senior"),
    availability: DataTypes.STRING,
    hourlyRate: DataTypes.FLOAT,
  },
  {
    sequelize,
    modelName: "Developer",
    tableName: "Developers",
    timestamps: true,
  }
);

export default Developer;
