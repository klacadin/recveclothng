"use client";

import dynamic from "next/dynamic";

const ClientApp = dynamic(() => import("@/app-shell/ClientApp"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  ),
});

export default function CatchAllPage() {
  return <ClientApp />;
}
