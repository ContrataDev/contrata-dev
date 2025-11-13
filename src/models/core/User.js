import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/database.js";

class User extends Model {
  static associate(models) {
    User.hasOne(models.Developer, { foreignKey: "userId" });
    User.hasOne(models.Client, { foreignKey: "userId" });
    User.belongsToMany(models.Organization, {
      through: models.OrganizationMembers,
    });
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true },
    passwordHash: DataTypes.STRING,
    role: { type: DataTypes.ENUM("developer", "client", "admin") },
    profilePicture: DataTypes.STRING,
    bio: DataTypes.TEXT,
    location: DataTypes.STRING,
    language: DataTypes.STRING,
    preferences: DataTypes.JSON,
  },
  {
    sequelize,
    modelName: "User",
    tableName: "Users",
    timestamps: true,
  }
);

export default User;
