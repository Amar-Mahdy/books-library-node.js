'use strict'
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();

// body parser middleware
app.use(express.json()) // parsing json in request body (req.body)

const data = require('./books.json');

function isInvalid(req) {
    if (typeof req.body == 'undefined' ||
    typeof req.body.author == 'undefined' ||
    typeof req.body.title == 'undefined' 
    ) {
        return true;
    }else{
        return false;
    }
}

app.get('/books',         (req, res) => {readBooks(req, res)})
app.post('/books',        (req, res) => {createBook(req, res)})
app.put('/books/:id',     (req, res) => {updateBook(req, res)})
app.delete('/books/:id',  (req, res) => {deleteBook(req, res)})

 // GET
function readBooks(req, res) {
    res.setHeader("content-type", "application/json")
    res.send(data)
}
 // CREATE
function createBook(req, res) {
  if(isInvalid(req)){
    res.status(400)
    res.send('invalid request')
    return;
   }
   const id = uuidv4();
   const newBook = {
       id:     id,
       title:  req.body.title,
       author: req.body.author
   }
   data.push(newBook)
   res.status(201) //stands for created
   res.send(id)
}
// UPDATE
function updateBook(req, res) {
    if(isInvalid(req)){
        res.status(400)
        res.send('invalid request')
        return;
    }
    const paramsId = req.params.id;
    const bookToUpdate = data.find(book => book.id == paramsId)
    if (typeof bookToUpdate == 'undefined' ) {
        res.status(404)
        res.send('no such book')
        return;
    }else{
        bookToUpdate.title = req.body.title
        bookToUpdate.author = req.body.author
        res.send('request has been updated')
    }

}
// DELETE
function deleteBook(req, res) {
    const paramsId = req.params.id;
    const bookToDelete = data.find(book => book.id == paramsId)
    if (typeof bookToDelete == 'undefined' ) {
        res.status(404)
        res.send('no such book')
        return;
    }else{
        const indexOfBookToDelete = data.indexOf(bookToDelete)
        console.log(indexOfBookToDelete);
        data.splice(indexOfBookToDelete, 1)
        res.send('request has been deleted')
    }
}















app.listen(3000,console.log('server running.....'))