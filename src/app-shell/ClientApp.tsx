"use client";

import { HelmetProvider } from "react-helmet-async";
import App from "@/App";

export default function ClientApp() {
  return (
    <HelmetProvider>
      <App />
    </HelmetProvider>
  );
}
