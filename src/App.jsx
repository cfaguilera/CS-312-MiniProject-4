import { useState, useEffect } from 'react';
import Signup from './components/Signup.jsx';
import Signin from './components/Signin.jsx';
import BlogPostForm from "./components/blogPostForm.jsx"
import PostList from './components/PostList.jsx';
import EditPostForm from './components/editPostForm.jsx';


function App() {

  // Setup states 
  const [posts, setPosts] = useState([])
  const [editingID, setEditingID] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [page, setPage] = useState("posts");
  const [username, setUsername] = useState("");
  const [deleteError, setDeleteError] = useState("");

  // Create a post

  async function handleCreate(postData) {
    const response = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: postData.title,
        content: postData.content,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error ?? "Could not create post");
    }

    setPosts((currentPosts) => [...currentPosts, data]);
  }
  
  // Handle updated post
  function handleUpdated(updatedPost) {
    setPosts((currentPosts) => currentPosts.map((post) => post.id === updatedPost.id ? updatedPost : post));
    resetForm();
  }

  // Delete a post
  async function handleDelete(id) {
    setDeleteError("");

    try {
      const response = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      const data = await response.json();

      if (!response.ok) {
        setDeleteError(data.error ?? "Could not delete post.");
        return;
      }

      setPosts((currentPosts) => currentPosts.filter((post) => post.id !== id));

      if (editingID === id) {
        resetForm();
      }
    } catch {
      setDeleteError("Could not connect to the server.");
    }
  }

  // Edit a post
  function handleEdit(post) {
    setEditingID(post.id);
  }

  // Reset the form after editing
  function resetForm() {
    setEditingID(null);
  }

  // Load posts from backend
  useEffect(() => {
    const controller = new AbortController();

  
    //Load posts
    async function loadPosts() {
      try {
        const response = await fetch("/api/posts", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Failed to load posts: ${response.status}`);
        }

        const data = await response.json();

        console.log("Posts: ", data);
        setPosts(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error(error);
        }
      }
    }

    loadPosts();

    return function() {
      controller.abort();
    }
  }, [username]); 

  // Setup dark mode
  useEffect(() => {
    // Dark mode
    document.body.classList.toggle("dark", darkMode);

    return function() {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  const editingPost = posts.find((post) => post.id === editingID);
  return (
    <>
    {/* Add Site Header */} 
    <header className="site-header">
      <a className="logo" href="/">
        Blogging For All
      </a>
      <nav>
        <a href='#posts' onClick={(event) => {
          event.preventDefault();
          setPage("posts");
        }}>Main Page</a>
        <p></p>

        <a href='#signup' onClick={(event) => {
          event.preventDefault();
          setPage("signup");
        }}>Sign up</a>

        <a href='#signin' onClick={(event) => {
          event.preventDefault();
          setPage("signin");
        }}>Sign in</a>


      </nav>
      <button id="theme-toggle" className="themeChangeButton" type="button" onClick={() => setDarkMode((current) => !current)}>
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>

      {username && <span>Signed in as {username}</span>}
    </header>
    {page === "signup" && <Signup />}
    {page === "signin" && (<Signin onSignin={(name) => {
      resetForm();
      setUsername(name);
      setPage("posts");
    }}
  />
)}
    {/* Main content of the page */}
    {page === "posts" && (
    <main>
      
      <section className="main-content">
        <p className="headerMain">Stories · Ideas · Community</p>
        <h1>Share what is on your mind.</h1>
        <p className="intro">
          Read posts from the community or publish a story of your own.
        </p>
      </section>

      <br></br>

      <h2>{editingID !== null ? "Edit Post" : "Create a new Post"}</h2>

      {/* Form to create a new post */}
      <br/>
      {editingPost ? (
        <EditPostForm key={editingPost.id} post={editingPost} onUpdated={handleUpdated} onCancel={resetForm} />
      ) : (
        <BlogPostForm onCreate={handleCreate} />
      )}
      {deleteError && <p role="alert">{deleteError}</p>}
      <PostList posts={posts} onEdit={handleEdit} onDelete={handleDelete}/>





    </main>
    )}
    </>
      
  )
}

export default App
