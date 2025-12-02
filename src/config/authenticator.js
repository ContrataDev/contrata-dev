import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import models from "../models/index.js";

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await models.User.findOne({ where: { email } });
        if (!user) {
          return done(null, false, { message: "Usuário não encontrado" });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
          return done(null, false, { message: "Senha incorreta" });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser(async (user, done) => {
  try {
    let userId = user.id;
    let clientId = null;
    let developerId = null;

    const client = await models.Client.findOne({ where: { userId } });
    if (client) clientId = client.id;

    const developer = await models.Developer.findOne({ where: { userId } });
    if (developer) developerId = developer.id;

    done(null, {
      userId,
      clientId,
      developerId,
    });
  } catch (err) {
    done(err);
  }
});

passport.deserializeUser(async (obj, done) => {
  try {
    const user = await models.User.findByPk(obj.userId);
    if (!user) return done(null, false);

    if (obj.clientId) {
      user.setDataValue("clientId", obj.clientId);
    }

    if (obj.developerId) {
      user.setDataValue("developerId", obj.developerId);
    }
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
