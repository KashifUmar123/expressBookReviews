const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(300).json(book);
  }
  return res.status(400).json({ message: "Please provide valid ISBN." });
  //Write your code here
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  // get keys of the books
  const booksKeys = Object.keys(books);

  for (const key of booksKeys) {
    const bookData = books[key];
    if (bookData.author == author) {
      return res.status(200).json(bookData);
    }
  }
  return res.status(400).json({ message: "Data not found" });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  // get keys of the books
  const booksKeys = Object.keys(books);

  for (const key of booksKeys) {
    const bookData = books[key];
    if (bookData.title == title) {
      return res.status(200).json(bookData);
    }
  }
  return res.status(400).json({ message: "Data not found" });
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
