"use client";

import { useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import App from "@/App";

export default function ClientApp() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    void navigator.serviceWorker.getRegistrations().then((regs) => {
      regs.forEach((reg) => {
        void reg.unregister();
      });
    });
    if (typeof caches === "undefined") return;
    void caches.keys().then((keys) => {
      keys.forEach((key) => {
        void caches.delete(key);
      });
    });
  }, []);

  return (
    <HelmetProvider>
      <App />
    </HelmetProvider>
  );
}
