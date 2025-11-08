// Configuração de Caminhos
import { fileURLToPath } from "url";
import path from "path";
import express from "express";
import session from "express-session";
import passport from "passport";

import Routers from "./config/routers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Banco de dados
import "./models/index.js";
// import auth config
import "./config/auth.js";

// Servidor Web
const app = express();

// Middleware para parsing de JSON e dados de formulário
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
	session({
		secret: process.env.SECRET,
		resave: false,
		saveUninitialized: false,
	})
);

// Configuração do servidor web
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "..", "public")));
app.use(passport.initialize());
app.use(passport.session());

// Usar as rotas
app.use("/", Routers);

export default app;
