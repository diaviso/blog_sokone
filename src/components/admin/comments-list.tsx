"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { approveComment, rejectComment, deleteComment } from "@/actions/comments";
import { toast } from "sonner";
import { Check, X, Trash2, ExternalLink } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils/format";
import Link from "next/link";
import type { Comment } from "@/types";

interface CommentsListProps {
  initialComments: Comment[];
}

export function CommentsList({ initialComments }: CommentsListProps) {
  const [comments, setComments] = useState(initialComments);
  const [isPending, startTransition] = useTransition();

  const handleApprove = (id: string) => {
    startTransition(async () => {
      const result = await approveComment(id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Comment approved");
        setComments((prev) =>
          prev.map((c) => (c.id === id ? { ...c, approved: true } : c))
        );
      }
    });
  };

  const handleReject = (id: string) => {
    startTransition(async () => {
      const result = await rejectComment(id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Comment rejected");
        setComments((prev) =>
          prev.map((c) => (c.id === id ? { ...c, approved: false } : c))
        );
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteComment(id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Comment deleted");
        setComments((prev) => prev.filter((c) => c.id !== id));
      }
    });
  };

  if (comments.length === 0) {
    return (
      <div className="p-12 text-center rounded-lg border border-border bg-card">
        <p className="text-muted-foreground">No comments yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <Card key={comment.id} className={comment.approved ? "" : "border-amber-200 dark:border-amber-800"}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">{comment.authorName}</span>
                  <span className="text-sm text-muted-foreground">
                    {comment.authorEmail}
                  </span>
                  {comment.approved ? (
                    <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      Approved
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                      Pending
                    </Badge>
                  )}
                </div>
                <p className="text-sm mb-2">{comment.content}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{formatRelativeTime(comment.createdAt)}</span>
                  <span>•</span>
                  <Link
                    href={`/blog/${comment.article?.slug}`}
                    className="hover:text-primary flex items-center gap-1"
                    target="_blank"
                  >
                    {comment.article?.title}
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {!comment.approved && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                    onClick={() => handleApprove(comment.id)}
                    disabled={isPending}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
                {comment.approved && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                    onClick={() => handleReject(comment.id)}
                    disabled={isPending}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleDelete(comment.id)}
                  disabled={isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
