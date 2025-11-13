import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/database.js";

class Proposal extends Model {
  static associate(models) {
    Proposal.belongsTo(models.JobPosting, { foreignKey: "jobPostingId" });
    Proposal.belongsTo(models.Developer, { foreignKey: "developerId" });
    Proposal.hasOne(models.Contract, { foreignKey: "proposalId" });
  }
}

Proposal.init(
  {
    price: DataTypes.FLOAT,
    estimatedTime: DataTypes.STRING,
    coverLetter: DataTypes.TEXT,
    status: DataTypes.ENUM("pending", "accepted", "rejected", "withdrawn"),
  },
  {
    sequelize,
    modelName: "Proposal",
    tableName: "Proposals",
    timestamps: true,
  }
);

export default Proposal;
