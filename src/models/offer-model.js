import { DataTypes, Model } from "sequelize";

import sequelize from "../config/database.js";

class OfferModel extends Model {}
OfferModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    budget: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Offer",
    tableName: "Offers",
  }
);

export default OfferModel;
