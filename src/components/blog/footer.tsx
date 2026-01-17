"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";

export function BlogFooter() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border bg-[#006400] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/blog" className="flex items-center gap-3 mb-4">
              <Image 
                src="/image.png" 
                alt="Khidmatoul Quran" 
                width={56} 
                height={56}
                className="h-14 w-auto bg-white rounded-lg p-1"
              />
              <div>
                <span className="text-xl font-bold text-white">KHIDMATOUL QURAN</span>
                <p className="text-sm text-white/80">Keur Cheikh El Hadji Amadou DEME</p>
              </div>
            </Link>
            <p className="text-white/80 max-w-md">
              {t("footer.description")}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-[#C0A060]">{t("footer.quickLinks")}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/blog"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  {t("common.home")}
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/search"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  {t("common.search")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-[#C0A060]">{t("footer.contact")}</h3>
            <ul className="space-y-2 text-white/80">
              <li>contact@khidmatoulquran.org</li>
              <li>Sokone, Sénégal</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/80">
            © {new Date().getFullYear()} Khidmatoul Quran. {t("footer.allRightsReserved")}
          </p>
          <p className="text-sm text-white/80 flex items-center gap-1">
            {t("footer.madeWith")} <Heart className="h-4 w-4 text-[#C0A060]" /> {t("footer.forCommunity")}
          </p>
        </div>
      </div>
    </footer>
  );
}
