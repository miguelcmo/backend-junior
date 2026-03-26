const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET = "supersecretkey";

const registerUser = async (db, data) => {

  const { name, email, password } = data;

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await db.run(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, hashedPassword]
  );

  return {
    id: result.lastID,
    name,
    email
  };

};

const loginUser = async (db, data) => {

  const { email, password } = data;

  const user = await db.get(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  if (!user) return null;

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) return null;

  const token = jwt.sign(
    { id: user.id, email: user.email },
    SECRET,
    { expiresIn: "1h" }
  );

  return { token };

};

module.exports = {
  registerUser,
  loginUser
};