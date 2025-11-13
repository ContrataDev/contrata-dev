import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/database.js";

class Milestone extends Model {
  static associate(models) {
    Milestone.belongsTo(models.Contract, { foreignKey: "contractId" });
    Milestone.hasMany(models.Deliverable, { foreignKey: "milestoneId" });
  }
}

Milestone.init(
  {
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    amount: DataTypes.FLOAT,
    dueDate: DataTypes.DATE,
    status: DataTypes.ENUM("pending", "submitted", "approved", "paid"),
  },
  {
    sequelize,
    modelName: "Milestone",
    tableName: "Milestones",
    timestamps: true,
  }
);

export default Milestone;
