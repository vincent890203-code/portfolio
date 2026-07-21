export type PostStatus = "draft" | "published";

export type Post = {
  id: string;
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD
  summary: string;
  tags: string[];
  body: string; // markdown
  status: PostStatus;
};

export type PostInput = Omit<Post, "id">;
