"use server";

import { db } from "@/lib/db";

export async function getDashboardStats() {
  const [
    totalArticles,
    publishedArticles,
    draftArticles,
    totalCategories,
    totalTags,
    totalComments,
    pendingComments,
    approvedComments,
    totalViews,
    recentArticles,
    recentComments,
    articles,
  ] = await Promise.all([
    db.article.count(),
    db.article.count({ where: { published: true } }),
    db.article.count({ where: { published: false } }),
    db.category.count(),
    db.tag.count(),
    db.comment.count(),
    db.comment.count({ where: { approved: false } }),
    db.comment.count({ where: { approved: true } }),
    db.article.aggregate({ _sum: { views: true } }),
    db.article.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { name: true } },
        category: { select: { name: true, color: true } },
      },
    }),
    db.comment.findMany({
      take: 5,
      where: { approved: false },
      orderBy: { createdAt: "desc" },
      include: {
        article: { select: { title: true, slug: true } },
      },
    }),
    db.article.findMany({
      select: { createdAt: true, views: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const monthNames = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
  
  const articlesByMonth: { month: string; count: number }[] = [];
  const viewsByMonth: { month: string; views: number }[] = [];
  
  const last6Months: Date[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    last6Months.push(date);
  }

  last6Months.forEach((date) => {
    const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear().toString().slice(-2)}`;
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
    
    const monthArticles = articles.filter((a: { createdAt: Date; views: number }) => {
      const articleDate = new Date(a.createdAt);
      return articleDate >= monthStart && articleDate <= monthEnd;
    });
    
    articlesByMonth.push({
      month: monthKey,
      count: monthArticles.length,
    });
    
    viewsByMonth.push({
      month: monthKey,
      views: monthArticles.reduce((sum: number, a: { views: number }) => sum + (a.views || 0), 0),
    });
  });

  return {
    stats: {
      totalArticles,
      publishedArticles,
      draftArticles,
      totalCategories,
      totalTags,
      totalComments,
      pendingComments,
      approvedComments,
      totalViews: totalViews._sum.views || 0,
    },
    recentArticles,
    recentComments,
    articlesByMonth,
    viewsByMonth,
  };
}
