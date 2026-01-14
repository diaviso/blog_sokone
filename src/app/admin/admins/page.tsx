import { Header } from "@/components/admin/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUsers } from "@/actions/users";
import { Plus, Edit } from "lucide-react";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { deleteUser } from "@/actions/users";
import { AdminDialog } from "@/components/admin/admin-dialog";
import { formatDate } from "@/lib/utils/format";
import type { User } from "@/types";

export default async function AdminsPage() {
  const users = await getUsers();

  return (
    <div className="min-h-screen">
      <Header
        title="Administrators"
        description="Manage admin users"
      />

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <Badge variant="secondary" className="text-sm">
            {users.length} administrators
          </Badge>
          <AdminDialog>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Administrator
            </Button>
          </AdminDialog>
        </div>

        <div className="rounded-lg border border-border overflow-hidden bg-card">
          {users.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground mb-4">
                No administrators found.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {(users as User[]).map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.image || undefined} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right text-sm text-muted-foreground">
                      <p>{user._count?.articles || 0} articles</p>
                      <p>Joined {formatDate(user.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <AdminDialog user={user}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </AdminDialog>
                      <DeleteDialog
                        title="Delete Administrator"
                        description={`Are you sure you want to delete "${user.name}"? Their articles will remain but will need a new author.`}
                        onDelete={async () => {
                          "use server";
                          return deleteUser(user.id);
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
