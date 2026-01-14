"use client";

import Link from "next/link";
import { BookOpen, Heart } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";

export function BlogFooter() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/blog" className="flex items-center gap-2 mb-4">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Sacred Blog</span>
            </Link>
            <p className="text-muted-foreground max-w-md">
              {t("footer.description")}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t("footer.quickLinks")}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/blog"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("common.home")}
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/search"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("common.search")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t("footer.contact")}</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>contact@sacredblog.org</li>
              <li>123 Faith Street</li>
              <li>Holy City, HC 12345</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Sacred Blog. {t("footer.allRightsReserved")}
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            {t("footer.madeWith")} <Heart className="h-4 w-4 text-red-500" /> {t("footer.forCommunity")}
          </p>
        </div>
      </div>
    </footer>
  );
}
