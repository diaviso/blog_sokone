import { Header } from "@/components/admin/header";
import { Badge } from "@/components/ui/badge";
import { getComments } from "@/actions/comments";
import { CommentsList } from "@/components/admin/comments-list";
import type { Comment } from "@/types";

export default async function CommentsPage() {
  const { comments, total } = await getComments();
  const pendingCount = comments.filter((c: Comment) => !c.approved).length;

  return (
    <div className="min-h-screen">
      <Header
        title="Comments"
        description="Moderate and manage comments"
      />

      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Badge variant="secondary" className="text-sm">
            {total} total
          </Badge>
          <Badge variant="outline" className="text-sm border-amber-500 text-amber-600">
            {pendingCount} pending
          </Badge>
        </div>

        <CommentsList initialComments={comments} />
      </div>
    </div>
  );
}
