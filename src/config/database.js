import { Sequelize } from "sequelize";
import "mysql2";

const dbName = process.env.DB_NAME;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

if (process.env.NODE_ENV !== "test") {
	if (!dbHost || !dbUser || !dbPort) {
		throw new Error(
			"Variáveis de banco MySQL obrigatórias não definidas: DB_HOST, DB_USER, DB_NAME",
		);
	}
}

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
	host: dbHost,
	port: dbPort,
	dialect: "mysql",
	dialectOptions: {
		connectTimeout: 10000,
	},
	pool: {
		max: 5,
		min: 1,
		acquire: 30000,
		idle: 10000,
	},
	retry: {
		max: 5,
	},
	logging: false,
});

export default sequelize;
