const jwt = require("jsonwebtoken");
const { promisify } = require("util");

async function auth(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Unauthorized. You must log in first." });
  }

  const token = authorization.split(" ")[1];

  try {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    req.id = decoded.user.id;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Unauthorized. Token has expired." });
    }
    return res.status(401).json({ message: "Unauthorized. Invalid token." });
  }
}

module.exports = { auth };
