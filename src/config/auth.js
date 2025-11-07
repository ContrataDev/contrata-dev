import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";

import UserModel from "../models/user-model";

passport.use(
	new LocalStrategy(
		{ usernameField: "email" },

		async function verify(email, password, cb) {
			try {
				const userDb = await UserModel.findOne({
					where: { email: email },
				});

				if (!userDb) {
					return cb(null, false, {
						message: "Email ou senha incorretos.",
					});
				}

				const isMatch = await bcrypt.compare(
					password,
					userDb.hashed_password
				);
				if (!isMatch) {
					return cb(null, false, {
						message: "Email ou senha incorretos.",
					});
				}

				return cb(null, userDb);
			} catch (err) {
				console.error("Erro na estratégia local do Passport:", err);
				return cb(err);
			}
		}
	)
);

passport.serializeUser(function (user, cb) {
	cb(null, user.id);
});

passport.deserializeUser(async function (id, cb) {
	try {
		const user = await UserModel.findByPk(id);

		cb(null, user);
	} catch (err) {
		cb(err);
	}
});

export default passport;
