import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/database.js";

class Contract extends Model {
  static associate(models) {
    Contract.belongsTo(models.Client, { foreignKey: "clientId" });
    Contract.belongsTo(models.Developer, { foreignKey: "developerId" });
    Contract.belongsTo(models.Project, { foreignKey: "projectId" });
    Contract.belongsTo(models.Proposal, { foreignKey: "proposalId" });
    Contract.hasMany(models.Milestone, { foreignKey: "contractId" });
    Contract.hasMany(models.Timesheet, { foreignKey: "contractId" });
  }
}

Contract.init(
  {
    terms: DataTypes.TEXT,
    fee: DataTypes.FLOAT,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    status: DataTypes.ENUM("active", "completed", "cancelled", "disputed"),
  },
  {
    sequelize,
    modelName: "Contract",
    tableName: "Contracts",
    timestamps: true,
  }
);

export default Contract;
