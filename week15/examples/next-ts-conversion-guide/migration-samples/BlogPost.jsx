export default function BlogPost({ post }) {
  return (
    <article>
      <h2>{post.title}</h2>
      <p>{post.body}</p>
      <small>Published at {new Date(post.date).toLocaleDateString()}</small>
    </article>
  );
}

// Masalah yang sering muncul:
// - `post` bisa undefined ketika fetch gagal
// - `post.date` bisa bukan string yang valid
