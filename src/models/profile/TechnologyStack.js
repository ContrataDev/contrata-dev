import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/database.js";

class TechnologyStack extends Model {
  static associate(models) {
    TechnologyStack.belongsTo(models.Developer, { foreignKey: "developerId" });
    TechnologyStack.belongsToMany(models.Skill, { through: "StackSkills" });
  }
}

TechnologyStack.init(
  {
    name: DataTypes.STRING, // ex: MERN, LAMP
    experienceYears: DataTypes.INTEGER,
    proficiency: DataTypes.ENUM("basic", "intermediate", "advanced", "expert"),
  },
  {
    sequelize,
    modelName: "TechnologyStack",
    tableName: "TechnologyStacks",
    timestamps: true,
  }
);

export default TechnologyStack;
