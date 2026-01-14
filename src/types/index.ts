export interface Author {
  id: string;
  name: string;
  image?: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  description?: string | null;
  _count?: { articles: number };
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  _count?: { articles: number };
}

export interface TagOnArticle {
  tag: Tag;
  tagId: string;
  articleId: string;
}

export interface Comment {
  id: string;
  content: string;
  authorName: string;
  authorEmail: string;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
  articleId: string;
  article?: {
    id: string;
    title: string;
    slug: string;
  };
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  featuredImage?: string | null;
  published: boolean;
  publishedAt?: Date | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImage?: string | null;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  author?: Author;
  categoryId?: string | null;
  category?: Category | null;
  tags?: TagOnArticle[];
  comments?: Comment[];
  _count?: { comments: number };
}

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  createdAt: Date;
  _count?: { articles: number };
}

export interface DashboardArticle {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  createdAt: Date;
  author: { name: string | null };
  category: { name: string; color: string } | null;
}

export interface DashboardComment {
  id: string;
  content: string;
  authorName: string;
  createdAt: Date;
  article: { title: string; slug: string };
}
