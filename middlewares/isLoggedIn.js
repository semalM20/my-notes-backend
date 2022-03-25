const jwt = require("jsonwebtoken");

//secret for jwt token
// const jwtSecret = process.env.JWT_SECRET;
const jwtSecret = "thisismynotesapp";

const isLoggedIn = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res
      .status(401)
      .json({ error: "please authenticate using a valid token" });
  }

  try {
    const data = jwt.verify(token, jwtSecret);
    req.user = data.id;
    next();
  } catch (error) {
    res.status(401).json({ error: "please authenticate using a valid token" });
  }

  //   const data = jwt.verify(token, jwtSecret);
  //   req.user = data.user;
  //   next();
};

module.exports = isLoggedIn;
