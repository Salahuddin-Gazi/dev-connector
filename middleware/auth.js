import jwt from "jsonwebtoken";
import config from "config";

// @Working Principle >> If there is a token or not & the token is valid or not

export default (req, res, next) => {
  // Get token from header
  const token = req.header("x-auth-token");

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // verify the token
  try {
    const decoded = jwt.verify(token, config.get("jwtSecrectKey"));
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ msg: "token is not valid" });
  }
};
