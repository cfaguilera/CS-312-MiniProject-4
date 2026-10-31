// Post list JSX file

function PostList({ posts, onEdit, onDelete}) {
    return (
        <section className="posts-section">
            <h2>Posts</h2>

            {posts.length === 0 && <p>No posts yet</p>}

            {posts.map((post) => (
                <article className="post-card" key={post.id}>
                    <h3>{post.title}</h3>

                    <p>By <strong>{post.creator}</strong> on{" "}{new Date(post.createdAt).toLocaleString()}
                    </p>

                    <p>{post.content}</p>

                    {post.canEdit && (
                    <div className="post-actions">
                        <button type="button" className="editButton" onClick={function() {
                            onEdit(post)}
                        }>Edit</button>
                    </div>
                    )}

                    {post.canEdit && (
                    <div className="post-actions">
                        <button type="button" className="deleteButton" onClick={function() {
                            onDelete(post.id)}
                        }>Delete</button>
                    </div>
                    )}
                </article>
            ))}
        </section>
    );
}

export default PostList;
