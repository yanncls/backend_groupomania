const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // console.log("decodedToken Id", decodedToken.userId);
    // console.log("decodedToken Admin", decodedToken.isAdmin);

    const userId = decodedToken.userId;
    req.userId = userId;
    const isAdmin = decodedToken.isAdmin;
    req.isAdmin = isAdmin;
    next();
  } catch (error) {
    res.status(401).json({ error: error | "Requête non authentifiée" });
  }
};
