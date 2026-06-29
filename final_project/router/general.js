const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  users.push({
    username: username,
    password: password
  })

  return res.status(200).json({message: "User successfully registered" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
   let getBooks = new Promise((resolve, reject) => {
    if (books) {
        resolve(books);
    } else {
        reject("Books not found");
    }
});

getBooks
   .then(bookList => res.status(200).json(bookList))
   .catch(error => res.status(404).json({ message: error }));

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
   
  let getBookByISBN = new Promise((resolve, reject) => {
    if (books[isbn]) {
        resolve(books[isbn]);
    } else {
        reject("Book not found");
    }
 });

 getBookByISBN
   .then(book => res.status(200).json(book))
   .catch(error => res.status(404).json({ message: error }));

});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let getBooksByAuthor = new Promise((resolve, reject)=> {
  const bookkeys = Object.keys(books);
  const authorBooks = {};

  bookkeys.forEach(key => {
    if (books[key].author === author) {
      authorBooks[key] = books[key];
    }
});
  if (Object.keys(authorBooks).length > 0) {
    resolve(authorBooks);
  } else {
    reject("Author not found");
  }
});

getBooksByAuthor
  .then(result => res.status(200).json(result))
  .catch(error => res.status(404).json({ message: error }));
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let getBooksByTitle = new Promise ((resolve, reject) => {
  const bookKeys = Object.keys(books);
  const titleBooks = {};

  bookKeys.forEach(key => {
    if (books[key].title === title) {
        titleBooks[key] = books[key];
    }
});    
  if (Object.keys(titleBooks).length > 0) {
    resolve(titleBooks);
  } else {
    reject("Title not found");
  }
});

getBooksByTitle
   .then(result => res.status(200).json(result))
   .catch(error => res.status(404).json({ message: error}));

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.json(books[isbn].reviews);
});

module.exports.general = public_users;
