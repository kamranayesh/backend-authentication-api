exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

exports.isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next();
  }
  res.status(403).json({ message: "Unauthorized" });
};
