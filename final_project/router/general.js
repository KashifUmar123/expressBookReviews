const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username) {
    return res.status(400).json({ message: "Please provide username" });
  }

  if (!password) {
    return res.status(400).json({ message: "Please provide password" });
  }

  if (
    users.filter((e) => e["username"].toLower == username.toLower).length > 0
  ) {
    return res.status(400).json({ message: `${username} already exists` });
  }

  // now push the user to users
  const newUser = {
    username,
    password,
  };

  users.push(newUser);

  return res.status(201).json({ message: "User registered successfully." });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  // use the promise and to act as an api, we will use 2 seconds wait
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books);
    }, 2000);
  });

  promise.then((value) => {
    return res.status(200).send(JSON.stringify(value, null, 4));
  });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      const isbn = req.params.isbn;
      const book = books[isbn];
      if (!book) {
        reject({ message: "Please provide valid ISBN." });
      }
      resolve(book);
    }, 2000);
  });

  promise
    .then((value) => {
      return res.status(300).json(value);
    })
    .catch((err) => {
      return res.status(400).json(err);
    });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      const author = req.params.author;
      // get keys of the books
      const booksKeys = Object.keys(books);
      for (const key of booksKeys) {
        const bookData = books[key];
        if (bookData.author == author) {
          resolve(bookData);
        }
      }
      reject({ message: "Data not found" });
    }, 2000);
  });

  promise
    .then((value) => {
      res.status(200).json(value);
    })
    .catch((err) => {
      return res.status(400).json(err);
    });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      const title = req.params.title;
      // get keys of the books
      const booksKeys = Object.keys(books);

      for (const key of booksKeys) {
        const bookData = books[key];
        if (bookData.title == title) {
          resolve(bookData);
        }
      }
      reject({ message: "Data not found" });
    }, 2000);
  });

  promise
    .then((value) => {
      res.status(200).json(value);
    })
    .catch((err) => {
      return res.status(400).json(err);
    });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book.reviews);
  }
  return res.status(400).json({ message: "Data not found" });
});

module.exports.general = public_users;
