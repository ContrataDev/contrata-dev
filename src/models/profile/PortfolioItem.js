import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/database.js";

class PortfolioItem extends Model {
  static associate(models) {
    PortfolioItem.belongsTo(models.Developer, { foreignKey: "developerId" });
  }
}

PortfolioItem.init(
  {
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    url: DataTypes.STRING,
    image: DataTypes.STRING,
    techUsed: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: "PortfolioItem",
    tableName: "PortfolioItems",
    timestamps: true,
  }
);

export default PortfolioItem;
