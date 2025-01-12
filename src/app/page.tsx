"use client";

import GenerateQuizForm from "@/components/forms/generate-quiz-form";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Generate a Quiz
      </h2>
      <GenerateQuizForm action="/generate" />
    </main>
  );
}
