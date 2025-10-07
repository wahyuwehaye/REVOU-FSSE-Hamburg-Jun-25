export interface BlogPostProps {
  post: {
    id: string;
    title: string;
    body: string;
    date: string;
  };
}

export function BlogPost({ post }: BlogPostProps) {
  const formattedDate = new Date(post.date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <article className="card">
      <h2>{post.title}</h2>
      <p>{post.body}</p>
      <small className="badge">Dipublikasikan {formattedDate}</small>
    </article>
  );
}

export type BlogPostSummary = Pick<BlogPostProps["post"], "id" | "title">;
