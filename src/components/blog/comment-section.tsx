"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { createComment } from "@/actions/comments";
import { toast } from "sonner";
import { Loader2, MessageSquare } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils/format";
import { useLanguage } from "@/lib/i18n/context";
import type { Comment } from "@/types";

interface CommentSectionProps {
  articleId: string;
  comments: Comment[];
}

export function CommentSection({ articleId, comments }: CommentSectionProps) {
  const { t } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const [localComments, setLocalComments] = useState(comments);

  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const result = await createComment({
        articleId,
        authorName,
        authorEmail,
        content,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(t("comments.successMessage"));
        setAuthorName("");
        setAuthorEmail("");
        setContent("");
      }
    });
  };

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <MessageSquare className="h-6 w-6" />
        {t("comments.title")} ({localComments.length})
      </h2>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">{t("comments.leaveComment")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="authorName">{t("comments.name")}</Label>
                <Input
                  id="authorName"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder={t("comments.name")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="authorEmail">{t("comments.email")}</Label>
                <Input
                  id="authorEmail"
                  type="email"
                  value={authorEmail}
                  onChange={(e) => setAuthorEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">{t("comments.comment")}</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={t("comments.shareThoughts")}
                rows={4}
                required
              />
            </div>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isPending ? t("comments.submitting") : t("comments.submit")}
            </Button>
          </form>
        </CardContent>
      </Card>

      {localComments.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          {t("comments.noComments")}
        </p>
      ) : (
        <div className="space-y-4">
          {localComments.map((comment) => (
            <Card key={comment.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {comment.authorName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{comment.authorName}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeTime(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
