import { Suspense } from "react";
import StickersPage from "./stickers-client";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <StickersPage />
    </Suspense>
  );
}
