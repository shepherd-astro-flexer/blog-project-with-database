const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const content = require(__dirname + `\\content.js`);
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://127.0.0.1:27017/blogDB");
// Schema
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    requuired: [true, "Please check your data entry, title not specified"]
  },
  post: {
    type: String,
    required: [true, "Please check your data entry, body not specified"]
  }
})
// Collections / Table name
const Blog = mongoose.model("Blog", blogSchema);

app.get("/", (req, res) => {
  Blog.find({}, (err, blogs) => {
    if (!err) {
      res.render("home", {content: content.homeContent, items: blogs});
    } else {
      console.log(err);
    }
  })
})

app.get("/compose", (req, res) => {
  res.render("compose");
})

app.post("/compose", (req, res) => {
  const title = _.capitalize(req.body.title);
  const post = req.body.post

  const blog = new Blog({
    title: title,
    post: post
  })

  Blog.findOne({title: title}, (err, results) => {
    console.log(results);
    if (!results) {
      blog.save();
    } else {
      console.log("Duplicated title");
    }
  })


  res.redirect("/");
})

app.get("/posts/:postName", (req, res) => {
  const params = _.capitalize(req.params.postName);
  console.log(params);
  Blog.findOne({title: params}, (err, blogs) => {
    console.log(blogs);
    if (!err) {
      res.render("post", {title: blogs.title, post: blogs.post});
    }
  })
})

app.get("/contacts", (req, res) => {
  res.render("contacts", {content: content.contactContent})
})

app.get("/about", (req, res) => {
  res.render("about", {content: content.aboutContent})
})

app.listen(3000, () => {
  console.log("Server has started on port 3000.");
})

// ! Continue with the routing 

