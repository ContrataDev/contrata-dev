import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/database.js";

class RateCard extends Model {
  static associate(models) {
    RateCard.belongsTo(models.Developer, { foreignKey: "developerId" });
  }
}

RateCard.init(
  {
    hourlyRate: DataTypes.FLOAT,
    projectRate: DataTypes.FLOAT,
    currency: DataTypes.STRING, // ex: "USD", "BRL"
    billingModel: DataTypes.ENUM("hourly", "fixed", "negotiable"),
  },
  {
    sequelize,
    modelName: "RateCard",
    tableName: "RateCards",
    timestamps: true,
  }
);

export default RateCard;
