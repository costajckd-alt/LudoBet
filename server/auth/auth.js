const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET = "LUDOBET_SECRET";

async function hashPassword(password){

  return await bcrypt.hash(password, 10);
}

async function comparePassword(
  password,
  hash
){

  return await bcrypt.compare(
    password,
    hash
  );
}

function createToken(user){

  return jwt.sign(
    {
      id: user._id
    },
    SECRET,
    {
      expiresIn: "7d"
    }
  );
}

module.exports = {
  hashPassword,
  comparePassword,
  createToken
};