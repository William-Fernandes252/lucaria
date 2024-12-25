import { example } from "@/lib/quizzes";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOllama, Ollama } from "@langchain/ollama";

const chatModel = new Ollama({
  baseUrl: "http://localhost:11434",
  model: "llama3.2",
});

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are a quiz generator, and you generate JSON formatted quizzes like the following example: ",
  ],
  ["system", JSON.stringify(example).replace(/{/g, "{{").replace(/}/g, "}}")],
  [
    "system",
    "You only output the JSON string, and nothing else. Make sure to add the closing bracket.",
  ],
  ["user", "Generate a quiz about {theme} with {questions} questions."],
]);

export default async function Home() {
  const message = await prompt
    .pipe(chatModel)
    .invoke({ theme: "Next.js", questions: 10 });
  try {
    console.log(JSON.parse(message));
  } catch (error) {
    console.error(error);
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {message}
    </main>
  );
}
