const adminAuth = (req, res, next) => {
  console.log("Authenticating admin");
  const token = "abc";
  const isAuthenticated = "abc" === token;
  if (!isAuthenticated) {
    res.status(401).send("Unauthorized request!");
  }
  next();
};

const userAuth = (req, res, next) => {
  console.log("Authenticating user");
  const token = "abc";
  const isAuthenticated = "abc" === token;
  if (!isAuthenticated) {
    res.status(401).send("Unauthorized request!");
  }
  next();
};

module.exports = { adminAuth, userAuth };
