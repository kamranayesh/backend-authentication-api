// routes/authRoutes.js
const express = require("express");
const passport = require("passport");
const { User, addUser, getUsers } = require("../models/user");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await User.hashPassword(password);
    const newUser = new User(getUsers().length + 1, username, hashedPassword);
    addUser(newUser);
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/auth/loginfail",
    failureFlash: true,
  })
);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/profile");
  }
);

router.get("/loginfail", (req, res) => {
  res.status(402).json({ message: req.flash("error") });
});

router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/auth");
  });
});

router.get("/", (req, res) => {
  res.status(201).json({ message: "Logged out!" });
});
module.exports = router;
