// routes/profileRoutes.js
const express = require("express");
const router = express.Router();
const { isAuthenticated, isAdmin } = require("../middleware/authMiddleware");
const { User, addUser, getUsers } = require("../models/user");

router.get("/publicProfiles", (req, res) => {
  try {
    const publicProfiles = getUsers().filter((user) => user.isPublic);
    res.json(publicProfiles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/profiles/:id", isAuthenticated, (req, res) => {
  try {
    const profile = getUsers().find(
      (user) => user.id === parseInt(req.params.id)
    );
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    if (!profile.isPublic && !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/profiles/:id", isAuthenticated, (req, res) => {
  try {
    const profile = getUsers().find(
      (user) => user.id === parseInt(req.params.id)
    );
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    if (req.user.isAdmin || req.user.id === profile.id) {
      profile.isPublic = req.body.isPublic;
      res.json(profile);
    } else {
      res.status(403).json({ message: "Unauthorized" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/", isAuthenticated, (req, res) => {
  try {
    const user = req.user;
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/profile", isAuthenticated, async (req, res) => {
  try {
    const currentUser = req.user;
    const users = getUsers();

    // Find the index of the current user in the users array
    const index = users.findIndex((user) => user.id === currentUser.id);

    if (index === -1) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.body.name) {
      users[index].name = req.body.name;
    }
    if (req.body.bio) {
      users[index].bio = req.body.bio;
    }
    if (req.body.phone) {
      users[index].phone = req.body.phone;
    }
    if (req.body.email) {
      users[index].email = req.body.email;
    }

    if (req.body.photo) {
      users[index].photo = req.body.photo;
    }

    if (req.body.isPublic !== undefined) {
      users[index].isPublic = req.body.isPublic;
    }

    res.json(users[index]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/all", isAuthenticated, isAdmin, (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const allProfiles = userData.getUsers();

    res.json(allProfiles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
