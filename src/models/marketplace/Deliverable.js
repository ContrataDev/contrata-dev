import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/database.js";

class Deliverable extends Model {
  static associate(models) {
    Deliverable.belongsTo(models.Milestone, { foreignKey: "milestoneId" });
  }
}

Deliverable.init(
  {
    description: DataTypes.TEXT,
    // fileLinks: DataTypes.ARRAY(DataTypes.STRING),
    submittedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "Deliverable",
    tableName: "Deliverables",
    timestamps: true,
  }
);

export default Deliverable;
