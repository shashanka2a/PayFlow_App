"use client";

import { AppRouter } from "./components/AppRouter";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <AppRouter />
      <Toaster />
    </div>
  );
}