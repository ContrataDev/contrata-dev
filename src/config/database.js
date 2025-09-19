import { Sequelize } from "sequelize";
import path from "path";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(
    process.cwd(),
    process.env.DATABASE_PATH || "data/database.sqlite"
  ),
  logging: false,
});

export default sequelize;
