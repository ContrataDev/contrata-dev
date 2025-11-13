import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/database.js";

class Timesheet extends Model {
  static associate(models) {
    Timesheet.belongsTo(models.Contract, { foreignKey: "contractId" });
    Timesheet.belongsTo(models.Developer, { foreignKey: "developerId" });
  }
}

Timesheet.init(
  {
    date: DataTypes.DATEONLY,
    hoursWorked: DataTypes.FLOAT,
    description: DataTypes.TEXT,
  },
  {
    sequelize,
    modelName: "Timesheet",
    tableName: "Timesheets",
    timestamps: true,
  }
);

export default Timesheet;
