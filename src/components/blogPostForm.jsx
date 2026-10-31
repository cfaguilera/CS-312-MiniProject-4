//Blog form JSX file

import { useState } from "react";

function BlogPostForm({ onCreate}) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");

        try {
            await onCreate({
                title: title.trim(),
                content: content.trim(),
            });

            setTitle("");
            setContent("");
        } catch (error) {
            setError(error.message);
        }
    }


    return (
        <form className="post-form" onSubmit={handleSubmit}>
        {error && <p role="alert">{error}</p>}
        <div>
            <label htmlFor="title">Blog title</label>
            <input type="text" id="title" name="title" required value={title} onChange={(event) => setTitle(event.target.value)} />
        </div>
        <div>
            <label htmlFor="content">Blog post</label>
            <textarea id="content" name="content" required rows="6" value={content} onChange={(event) => setContent(event.target.value)}></textarea>
        </div>
        <button type="submit" className="postButton">Create Post</button>
      </form>
    )
}

export default BlogPostForm

