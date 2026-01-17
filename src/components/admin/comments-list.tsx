"use client";

import { useState, useMemo, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { approveComment, rejectComment, deleteComment } from "@/actions/comments";
import { toast } from "sonner";
import { Check, X, Trash2, ExternalLink, Search, Filter, MessageSquare, User, Mail } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils/format";
import Link from "next/link";
import type { Comment } from "@/types";

interface CommentsListProps {
  initialComments: Comment[];
}

export function CommentsList({ initialComments }: CommentsListProps) {
  const [comments, setComments] = useState(initialComments);
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredComments = useMemo(() => {
    return comments.filter((comment) => {
      const matchesSearch = search === "" ||
        comment.authorName.toLowerCase().includes(search.toLowerCase()) ||
        comment.authorEmail.toLowerCase().includes(search.toLowerCase()) ||
        comment.content.toLowerCase().includes(search.toLowerCase()) ||
        comment.article?.title?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === "all" ||
        (statusFilter === "approved" && comment.approved) ||
        (statusFilter === "rejected" && !comment.approved);

      return matchesSearch && matchesStatus;
    });
  }, [comments, search, statusFilter]);

  const handleApprove = (id: string) => {
    startTransition(async () => {
      const result = await approveComment(id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Commentaire approuvé");
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
        toast.success("Commentaire désapprouvé");
        setComments((prev) =>
          prev.map((c) => (c.id === id ? { ...c, approved: false } : c))
        );
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ?")) return;
    
    startTransition(async () => {
      const result = await deleteComment(id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Commentaire supprimé");
        setComments((prev) => prev.filter((c) => c.id !== id));
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par auteur, email, contenu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="approved">Approuvés</SelectItem>
            <SelectItem value="rejected">Désapprouvés</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>{filteredComments.length} commentaire{filteredComments.length !== 1 ? 's' : ''}</span>
        {(search || statusFilter !== "all") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setSearch(""); setStatusFilter("all"); }}
            className="h-auto py-1 px-2 text-xs"
          >
            Réinitialiser
          </Button>
        )}
      </div>

      {/* Comments List */}
      {filteredComments.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <MessageSquare className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">Aucun commentaire</h3>
            <p className="text-muted-foreground">
              {search || statusFilter !== "all"
                ? "Aucun commentaire ne correspond à vos critères"
                : "Les commentaires de vos articles apparaîtront ici"}
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredComments.map((comment) => (
            <Card 
              key={comment.id} 
              className={`group hover:shadow-md transition-all duration-300 ${
                comment.approved 
                  ? "border-l-4 border-l-green-500" 
                  : "border-l-4 border-l-red-500"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Avatar */}
                  <Avatar className="h-12 w-12 shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {comment.authorName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold">{comment.authorName}</span>
                          {comment.approved ? (
                            <Badge className="bg-green-500 hover:bg-green-600 text-white text-xs">
                              Approuvé
                            </Badge>
                          ) : (
                            <Badge className="bg-red-500 hover:bg-red-600 text-white text-xs">
                              Désapprouvé
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                          <Mail className="h-3 w-3" />
                          <span>{comment.authorEmail}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        {comment.approved ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                            onClick={() => handleReject(comment.id)}
                            disabled={isPending}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Désapprouver
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                            onClick={() => handleApprove(comment.id)}
                            disabled={isPending}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approuver
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(comment.id)}
                          disabled={isPending}
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Comment content */}
                    <p className="text-sm mb-3 bg-muted/50 rounded-lg p-3">
                      {comment.content}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{formatRelativeTime(comment.createdAt)}</span>
                      <span>•</span>
                      <Link
                        href={`/blog/${comment.article?.slug}`}
                        className="hover:text-primary flex items-center gap-1 truncate"
                        target="_blank"
                      >
                        <span className="truncate">{comment.article?.title}</span>
                        <ExternalLink className="h-3 w-3 shrink-0" />
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
