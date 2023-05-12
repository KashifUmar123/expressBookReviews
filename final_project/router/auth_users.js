const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
  const filteredUsers = users.filter(
    (e) => e.username == username && e.password == password
  );
  if (filteredUsers.length > 0) {
    return true;
  }
  return false;
};

//only registered users can login
regd_users.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username) {
    return res.status(400).json({ message: "Please provide username" });
  }

  if (!password) {
    return res.status(400).json({ message: "Please provide password" });
  }

  if (authenticatedUser(username, password)) {
    // sign the jwt
    let token = jwt.sign(password, "access");

    req.session.authorization = {
      token,
      username,
    };
    return res.status(201).json({ message: "User logged in", token });
  }

  return res.status(401).json({ message: "Wrong email or password" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  // check if the book exists
  if (!review) {
    return res.status(400).json({ message: "review not found in query" });
  }
  const book = books[isbn];

  // get keys of the reviews object
  if (book) {
    books[isbn].reviews[req.session.authorization.username] = review;
    return res.status(200).json({ message: "Review added", book });
  }
  //Write your code here
  return res.status(404).json({ message: "Book not found" });
});

regd_users.get("/test", (req, res) => {
  res.send("customet auth test");
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  try {
    console.log("here");
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // check if the user have the review
    const reviewKeys = Object.keys(book.reviews);
    if (!reviewKeys.includes(req.session.authorization.username)) {
      return res
        .status(400)
        .json({ message: "You haven't reviewd the book yet." });
    }
    // remove the review now
    delete books[isbn].reviews[req.session.authorization.username];
    return res.status(200).json({ message: "Review removed", book: book });
  } catch (e) {
    console.log(`ERROR: ${e}`);
    throw e;
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
