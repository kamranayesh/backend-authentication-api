let express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const flash = require("connect-flash");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const { getUsers } = require("./models/user");

const app = express();
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "secret", // Change this to a more secure secret in production
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Passport local strategy configuration
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = getUsers().find((user) => user.username === username);
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      if (!(await bcrypt.compare(password, user.password))) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = getUsers().find((user) => user.id === id);
  done(null, user);
});

// Routes
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
