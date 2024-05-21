import express from "express";
import bodyParser from "body-parser";;

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

let blogPosts = [];

app.get("/", (req, res) => {
  res.render("index.ejs", { blogPosts: blogPosts });
});

app.post("/", (req, res) => {
  const blogText = req.body.blogtext;
  if (typeof blogText === 'string' && blogText.trim() !== "") {
    // Lägger till ett objekt med en titel-egenskap
    blogPosts.push({ title: blogText.trim() });
  }
  res.redirect("/");
});

app.get("/posts/new", (req, res) => {
  res.render("newPost");
});

app.get("/posts/:index", (req, res) => {
  const index = req.params.index;
  const post = blogPosts[index];
  if (post) {
    res.render("showpost.ejs", { post: post });
  } else {
    res.status(404).send("Inlägg ej hittat");
  }
});

app.get("/posts/:index/edit", (req, res) => {
  const index = req.params.index;
  const postToEdit = blogPosts[index];
  if (postToEdit) {
    res.render("editpost.ejs", { index: index, post: postToEdit });
  } else {
    res.status(404).send("Inlägg ej hittat");
  }
});

app.post("/posts", (req, res) => {
  const title = req.body.title; // Hämtar titel från formuläret
  const content = req.body.content; // Hämtar innehåll från formuläret
  if (title && content) {
    // Tilldelar ett unikt identifierare till varje inlägg
    const id = blogPosts.length;
    blogPosts.push({ id: id, title: title, content: content });
  }
  
  res.redirect("/"); // Omdirigera till startsidan efter att ha lagt till det nya inlägget
});

app.post("/edit/:index", (req, res) => {
  const index = req.params.index;
  const editedPost = {
    title: req.body.title,
    content: req.body.content
  };
  // Uppdatera det korrekta inlägget i blogPosts-arrayen
  blogPosts[index] = editedPost;
  res.redirect("/");
});

app.post("/delete/:index", (req, res) => {
  const index = req.params.index;
  // Ta bort inlägget vid angivet index från blogPosts-arrayen
  blogPosts.splice(index, 1);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Servern körs på port ${port}`);
});