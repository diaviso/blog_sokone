"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Tags,
  MessageSquare,
  Users,
  LogOut,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/lib/i18n/context";
import { logoutAction } from "@/actions/auth";
import { useState } from "react";
import { LucideIcon } from "lucide-react";

interface NavItem {
  titleKey: string;
  href: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  {
    titleKey: "sidebar.dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    titleKey: "sidebar.articles",
    href: "/admin/articles",
    icon: FileText,
  },
  {
    titleKey: "sidebar.categories",
    href: "/admin/categories",
    icon: FolderOpen,
  },
  {
    titleKey: "sidebar.tags",
    href: "/admin/tags",
    icon: Tags,
  },
  {
    titleKey: "sidebar.comments",
    href: "/admin/comments",
    icon: MessageSquare,
  },
  {
    titleKey: "sidebar.administrators",
    href: "/admin/admins",
    icon: Users,
  },
];

interface SidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useLanguage();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-card border-r border-border transition-all duration-300 ease-in-out flex flex-col",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-border">
        <Link
          href="/admin/dashboard"
          className={cn(
            "flex items-center gap-2 font-semibold text-lg transition-opacity",
            collapsed && "opacity-0 w-0 overflow-hidden"
          )}
        >
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="gradient-text">Sacred Blog</span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span
                    className={cn(
                      "transition-opacity duration-200",
                      collapsed && "opacity-0 w-0 overflow-hidden"
                    )}
                  >
                    {t(item.titleKey)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-3 border-t border-border">
        <div
          className={cn(
            "flex items-center gap-3 p-2 rounded-lg bg-accent/50 mb-3",
            collapsed && "justify-center"
          )}
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.image || undefined} />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              {user.name?.charAt(0).toUpperCase() || "A"}
            </AvatarFallback>
          </Avatar>
          <div
            className={cn(
              "flex-1 min-w-0 transition-opacity duration-200",
              collapsed && "opacity-0 w-0 overflow-hidden"
            )}
          >
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        </div>

        <div className={cn(
          "flex items-center gap-1 mb-2",
          collapsed ? "justify-center" : "justify-start"
        )}>
          <ThemeToggle />
          <LanguageToggle />
        </div>

        <Separator className="my-2" />

        <form action={logoutAction}>
          <Button
            type="submit"
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10",
              collapsed && "justify-center px-0"
            )}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            <span
              className={cn(
                "transition-opacity duration-200",
                collapsed && "opacity-0 w-0 overflow-hidden"
              )}
            >
              {t("sidebar.signOut")}
            </span>
          </Button>
        </form>
      </div>
    </aside>
  );
}
