let express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcryptjs");
const flash = require("connect-flash");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const { User, getUsers, addUser } = require("./models/user");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

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

passport.use(
  new GoogleStrategy(
    {
      clientID: "GOOGLE_CLIENT_ID", //replace with your google client id
      clientSecret: "GOOGLE_CLIENT_SECRET", //replace with your google client secret
      callbackURL: "http://localhost:3000/auth/google/callback", // Update with your callback URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await getUsers().findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        } else {
          const newUser = new User({
            googleId: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value,
          });
          addUser(newUser);

          await newUser.save();
          return done(null, newUser);
        }
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = getUsers().find((user) => user.id === id);
  done(null, user);
});

app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
