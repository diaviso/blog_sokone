"use client";

import { useLanguage } from "@/lib/i18n/context";

export function DashboardHeader() {
  const { t } = useLanguage();

  return (
    <div className="border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t("dashboard.title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("dashboard.description")}
          </p>
        </div>
      </div>
    </div>
  );
}
