import "mysql2";
import "sqlite3";

import { Sequelize } from "sequelize";
import path from "path";

const env = process.env.NODE_ENV || "development";

let sequelize;

if (env === "production") {
	// Usa MySQL em produção
	const {
		DB_HOST,
		DB_PORT = 3306,
		DB_USER,
		DB_PASSWORD,
		DB_NAME,
	} = process.env;

	if (!DB_HOST || !DB_USER || !DB_NAME) {
		throw new Error(
			"Variáveis de banco MySQL obrigatórias não definidas: DB_HOST, DB_USER, DB_NAME"
		);
	}

	sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
		host: DB_HOST,
		port: DB_PORT,
		dialect: "mysql",
		logging: process.env.DEBUG === "true" ? console.log : false,
		dialectOptions: {
			timezone: "-03:00",
		},
		pool: {
			max: 5,
			min: 0,
			acquire: 30000,
			idle: 10000,
		},
	});
} else {
	// Usa SQLite em desenvolvimento/teste
	const storagePath =
		process.env.DATABASE_PATH ||
		path.join(process.cwd(), "data/database.sqlite");

	sequelize = new Sequelize({
		dialect: "sqlite",
		storage: storagePath,
		logging: process.env.DEBUG === "true" ? console.log : false,
		define: {
			underscored: true,
			timestamps: true,
		},
	});
}

export default sequelize;
