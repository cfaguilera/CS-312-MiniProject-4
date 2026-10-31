// Imports and setup
const express = require("express");
const session = require("express-session");
const {randomUUID, randomBytes} = require("node:crypto");


const app = express();
const PORT = 4000;

// Store blog posts and users while the server is running
const posts = [];
const users = [];


// Begin session
app.use(express.json());

app.use(session({
    secret: randomBytes(32).toString('hex'),
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 60 * 60 * 1000,
    },
}));

// check if the user can edit 
function postForUser(post, userId) {
    return {
        ...post, 
        canEdit: Boolean(userId && post.ownerId === userId),
    };
}

// Signup route
app.post("/api/signup", (req, res) => {
    const {username, password } = req.body ?? {};

    if (typeof username !== "string" || typeof password !== "string" || !username.trim() || !password.trim()) {
        return res.status(400).json({
            error: "username and password are required",
        });
    }

    const cleanName = username.trim();

    const existingUser = users.find((user => user.username === cleanName));
    
    if (existingUser) {
        return res.status(409).json({
            error: "username is taken,",
        });
    }

    users.push({ 
        id: randomUUID(),
        username: cleanName,
        password,
    });

    res.status(201).json({
        message: "Account created",
    });
})

// Signin route
app.post("/api/signin", (req, res) => {
    const {username, password } = req.body ?? {};

    if (typeof username !== "string" || typeof password !== "string" || !username.trim() || !password.trim()) {
        return res.status(400).json({
            error: "username and password are required",
        });
    }

    const user = users.find((user) => user.username === username.trim() && user.password === password);
    
    if (!user) {
        return res.status(401).json({
            error: "Incorrect username or password",
        });
    }

    req.session.regenerate((error) => {
        if (error) {
            return res.status(500).json({
                error: "Could not sign in, try again",
            });
        }

        req.session.userId = user.id;

        console.log("Signed in");

        res.json({
            message: "Signed in successfully",
            username: user.username,
        });
    });
});

// Ensure posts have all required fields
function validatePost(req, res, next) {
    const { creator, title, content } = req.body;

    if (!creator || !title || !content) {
        return res.status(400).json({ error: "Missing 1 or more required fields" });
    }
    next();
}

// Get all posts
app.get("/api/posts", (req, res) => {
    res.json(posts.map((post) => postForUser(post, req.session.userId)));
});

//Create a new post by the signed in user
app.post("/api/posts", (req, res) => {
    const user = users.find((user) => user.id === req.session.userId);

    if (!user) {
        return res.status(401).json({
            error: "Please sign in before making a post",
        });
    }

    const {title, content} = req.body ?? {};

    if (typeof title !== "string" || typeof content !== "string" || !title.trim() || !content.trim()) {
        return res.status(400).json({
            error: "Title and content are required",
        });
    }

    const post = {
        id: randomUUID(),
        ownerId: user.id,
        creator: user.username,
        title: title.trim(),
        content: content.trim(),
        createdAt: new Date().toISOString(),
    };

    posts.push(post);
    res.status(201).json(postForUser(post, req.session.userId));
}
)

// Update a post only by the right user
app.put("/api/posts/:id", (req, res) => {
    const user = users.find((user) => user.id === req.session.userId);

    if (!user) {
        return res.status(401).json({
            error: "Please sign in before editing a post",
        });
    }

    const post = posts.find((post) => post.id === req.params.id);

    if (!post) {
        return res.status(404).json({
            error: "Post not found",
        });
    }

    if (post.ownerId !== user.id) {
        return res.status(403).json({
            error: "you can only edit your own posts",
        });
    }

    const { title, content } = req.body ?? {};

    if (typeof title !== "string" || typeof content !== "string" || !title.trim() || !content.trim()) {
        return res.status(400).json({
            error: "Title and content are required",
        });
    }


    post.title = title.trim();
    post.content = content.trim();

    res.json(postForUser(post, req.session.userId));
});

// Delete a post
app.delete('/api/posts/:id', (req, res) => {
    const user = users.find((user) => user.id === req.session.userId);

    if (!user) {
        return res.status(401).json({ error: "Please sign in before deleting a post" });
    }

    const postIndex = posts.findIndex((post) => post.id === req.params.id);

    if (postIndex === -1) {
        return res.status(404).json({ error: "Post not found" });
    }

    if (posts[postIndex].ownerId !== user.id) {
        return res.status(403).json({ error: "You can only delete your own posts" });
    }

    posts.splice(postIndex, 1);
    res.status(200).json({ message: "Post deleted successfully" });
});

// Start the server
app.listen(PORT, () => {
    console.log(`API running at http://localhost:${PORT}`);
});
