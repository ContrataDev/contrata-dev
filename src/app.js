import createError from "http-errors";
import express from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import logger from "morgan";
import flash from "connect-flash";

import { sequelize } from "./models/index.js";
import passport from "./config/authenticator.js";
import indexWebRouter from "./routers/web/index.js";
import indexApiRouter from "./routers/api/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "..", "public")));

app.use(
  session({ secret: "segredo", resave: false, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use("/", indexWebRouter);
app.use("/api", indexApiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexão com o banco estabelecida!");

    if (process.env.NODE_ENV == "development") {
      await sequelize.sync({ alter: true });
    } else {
      await sequelize.sync();
    }

    console.log("✅ Tabelas sincronizadas!");
  } catch (err) {
    console.error("❌ Erro ao conectar:", err);
  }
})();

export default app;
