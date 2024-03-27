const bcrypt = require("bcryptjs");

class User {
  constructor(
    id,
    username,
    password,
    isAdmin = false,
    isPublic = true,
    photo = null,
    name = null,
    bio = null,
    phone = null,
    email = null
  ) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.isAdmin = isAdmin;
    this.isPublic = isPublic;
    this.photo = photo;
    this.name = name;
    this.bio = bio;
    this.phone = phone;
    this.email = email;
  }

  static async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }
}

const usersArray = [new User(1, "dummy", "password")]; // Initialize with a dummy user

function addUser(user) {
  usersArray.push(user);
}

function getUsers() {
  return usersArray;
}

module.exports = { User, addUser, getUsers };
