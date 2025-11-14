export function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error_msg", "Você precisa estar logado para acessar esta página");
  res.redirect("/auth");
}

export function isDeveloper(req, res, next) {
  if (req.isAuthenticated() && req.user.role === "developer") {
    return next();
  }
  res.redirect("/auth?type=login");
}

export function isClient(req, res, next) {
  if (req.isAuthenticated() && req.user.role === "client") {
    return next();
  }
  res.redirect("/auth?type=login");
}
