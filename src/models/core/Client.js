import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/database.js";

class Client extends Model {
  static associate(models) {
    Client.belongsTo(models.User, { foreignKey: "userId" });
    Client.hasMany(models.Project, { foreignKey: "clientId" });
    Client.hasMany(models.Contract, { foreignKey: "clientId" });
  }
}

Client.init(
  {
    userId: { type: DataTypes.UUID, allowNull: false },
    companyName: DataTypes.STRING,
    budgetRange: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: "Client",
    tableName: "Clients",
    timestamps: true,
  }
);

export default Client;
