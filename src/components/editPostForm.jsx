// Edit post form JSX file

import { useState} from 'react';

function EditPostForm({ post, onUpdated, onCancel}) {
    const [title, setTitle] = useState(post.title);
    const [content, setContent] = useState(post.content);
    const [error, setError] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");

        try {
            const response = await fetch(`/api/posts/${post.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: title.trim(),
                    content: content.trim(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error ?? "Could not update post.");
                return;
            }

            onUpdated(data);
        } catch {
            setError("Could not connect to server");
        }
    }

    return (
        <form className="post-form" onSubmit={handleSubmit}>
        {error && <p role="alert">{error}</p>}
        
        <div>
            <label htmlFor="edit-title">Blog title</label>
            <input id="edit-title" required value={title} onChange={(event) => setTitle(event.target.value)} />
        </div>
        <div>
            <label htmlFor="edit-content">Blog post</label>
            <textarea id="edit-content" required rows="6" value={content} onChange={(event) => setContent(event.target.value)}></textarea>
        </div>
        <div className='post-actions'>
            <button type="submit" className="postButton">Save changes</button>
            <button type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    )
}


export default EditPostForm;