// Import express
const express = require("express");

// Initialize express app and port
const app = express();
const PORT = 3000;

// Store blog posts while the server is running
const posts = [];

// Use ejs templates, understand URLencoded data, and serve static files from the public folder
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Define routes
app.get("/", (req, res) => {
    res.render("index", { posts });
});

// Post forms
app.post("/posts", (req, res) => {
    const { creator, title, content } = req.body;

    const newPost = {
        id: Date.now(),
        creator, title, content,
        createdAt: new Date(),
    
    };
    // Store the post temporarily
    posts.push(newPost);

    // Return to homepage
    res.redirect("/");
    
});

// Edit a post
app.get("/posts/:id/edit", (req, res) => {
    // Convert URL id into a number
    const postID = Number(req.params.id);

    // Find the post with the ID
    const post = posts.find((post) => post.id === postID);

    // If post DNE, stop the process
    if (!post) {
        return res.status(404).send("Post not found");
    }

    // Send existing post to the edit page
    res.render("edit", { post });
});

// Post the edited post
app.post("/posts/:id/edit", (req, res) => {
    const postID = Number(req.params.id);
    const postIndex = posts.findIndex((post) => post.id === postID);

    // If post DNE, stop the process
    if (postIndex === -1) {
        return res.status(404).send("Post not found");
    }

    const { creator, title, content } = req.body;

    // Update the post with new data
    posts[postIndex] = {
        ...posts[postIndex],
        creator,
        title,
        content
    };

    // Return to homepage
    res.redirect("/");
});


// Delete a post
app.post("/posts/:id/delete", (req, res) => {
    const postID = Number(req.params.id);
    const postIndex = posts.findIndex((post) => post.id === postID);
    // If post DNE, stop the process
    if (postIndex === -1) {
        return res.status(404).send("Post not found");
    }

    // Remove the post from the array
    posts.splice(postIndex, 1);

    // Return to homepage
    res.redirect("/");
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});


