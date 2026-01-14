import Link from "next/link";
import { BookOpen, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCategories } from "@/actions/categories";
import { BlogHeaderClient } from "./header-client";
import type { Category } from "@/types";

export async function BlogHeader() {
  const categories = await getCategories();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/blog" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold gradient-text">Sacred Blog</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <BlogHeaderClient categories={categories as Category[]} />
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/blog/search">
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
