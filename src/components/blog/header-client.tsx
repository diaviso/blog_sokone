"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import type { Category } from "@/types";

interface BlogHeaderClientProps {
  categories: Category[];
}

export function BlogHeaderClient({ categories }: BlogHeaderClientProps) {
  const { t } = useLanguage();

  return (
    <>
      <Link
        href="/blog"
        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        {t("common.home")}
      </Link>
      {categories.slice(0, 4).map((category) => (
        <Link
          key={category.id}
          href={`/blog/category/${category.slug}`}
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          {category.name}
        </Link>
      ))}
      <div className="flex items-center gap-1 ml-4">
        <ThemeToggle />
        <LanguageToggle />
      </div>
    </>
  );
}
