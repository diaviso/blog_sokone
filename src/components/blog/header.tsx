import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCategories } from "@/actions/categories";
import { BlogHeaderClient } from "./header-client";
import type { Category } from "@/types";

export async function BlogHeader() {
  const categories = await getCategories();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <Link href="/blog" className="flex items-center gap-3">
            <Image 
              src="/image.png" 
              alt="Khidmatoul Quran" 
              width={48} 
              height={48}
              className="h-12 w-auto"
            />
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-[#006400]">KHIDMATOUL QURAN</span>
              <p className="text-xs text-muted-foreground">Keur Cheikh El Hadji Amadou DEME</p>
            </div>
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
