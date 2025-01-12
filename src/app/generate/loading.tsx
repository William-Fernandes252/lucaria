import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Loader2 className="animate-spin size-10" />
    </main>
  );
}
