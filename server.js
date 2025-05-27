const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use(express.json());

app.get("/api/posts", (req, res) => {
  const posts = JSON.parse(fs.readFileSync("posts.json"));
  res.json(posts);
});

app.get("/api/posts/:id", (req, res) => {
  const posts = JSON.parse(fs.readFileSync("posts.json"));
  const post = posts.find(p => p.id == req.params.id);
  res.json(post || {});
});

app.post("/api/posts", (req, res) => {
  const posts = JSON.parse(fs.readFileSync("posts.json"));
  const newPost = {
    id: Date.now(),
    title: req.body.title,
    content: req.body.content,
  };
  posts.push(newPost);
  fs.writeFileSync("posts.json", JSON.stringify(posts, null, 2));
  res.status(201).json(newPost);
});

// SPA fallback to index.html for client-side routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
