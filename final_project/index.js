const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;

const app = express();

app.use(express.json());

app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/customer/auth/*", function auth(req, res, next) {
  //Write the authenication mechanism here
  try {
    if (req.session.authorization) {
      let token = req.session.authorization["token"];
      // verify the token
      jwt.verify(token, "access", (err, _) => {
        if (err) {
          return res.status(401).json({ mssage: "User not authenticated" });
        } else {
          return next();
        }
      });
    } else {
      return res.status(401).json({ message: "Please authenticate yourself." });
    }
  } catch (e) {
    throw e;
  }
});

const PORT = 3002;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
