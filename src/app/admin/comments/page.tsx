import { Header } from "@/components/admin/header";
import { Card, CardContent } from "@/components/ui/card";
import { getComments } from "@/actions/comments";
import { CommentsList } from "@/components/admin/comments-list";
import { MessageSquare, CheckCircle, XCircle, Clock } from "lucide-react";
import type { Comment } from "@/types";

export default async function CommentsPage() {
  const { comments, total } = await getComments({ limit: 100 });
  const approvedCount = comments.filter((c: Comment) => c.approved).length;
  const rejectedCount = comments.filter((c: Comment) => !c.approved).length;

  return (
    <div className="min-h-screen">
      <Header
        title="Commentaires"
        description="Modérez et gérez les commentaires de vos articles"
      />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200/50 dark:border-blue-800/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{total}</p>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-200/50 dark:border-green-800/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{approvedCount}</p>
                  <p className="text-sm text-muted-foreground">Approuvés</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-200/50 dark:border-red-800/50 col-span-2 md:col-span-1">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/20">
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{rejectedCount}</p>
                  <p className="text-sm text-muted-foreground">Désapprouvés</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <CommentsList initialComments={comments} />
      </div>
    </div>
  );
}
