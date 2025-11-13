import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/database.js";

class Availability extends Model {
  static associate(models) {
    Availability.belongsTo(models.Developer, { foreignKey: "developerId" });
  }
}

Availability.init(
  {
    timezone: DataTypes.STRING,
    weeklyHours: DataTypes.INTEGER,
    startDate: DataTypes.DATE,
    preferredSchedule: DataTypes.STRING, // ex: "Mon-Fri, 9h-18h"
  },
  {
    sequelize,
    modelName: "Availability",
    tableName: "Availabilities",
    timestamps: true,
  }
);

export default Availability;
