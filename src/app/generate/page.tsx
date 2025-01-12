import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { generateQuiz } from "@/use-cases";
import { Effect } from "effect";

type GenerateProps = {
  searchParams: Promise<Record<string, unknown>>;
};

export default async function Generate({ searchParams }: GenerateProps) {
  const result = await Effect.runPromiseExit(generateQuiz(await searchParams));
  return result._tag === "Success" ? (
    <main className="flex min-h-screen flex-col items-center justify-center p-16">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl">{result.value.title}</CardTitle>
          <CardDescription>Generation result.</CardDescription>
        </CardHeader>
        <CardContent>
          {result.value.questions.map(({ question, options, correct }, i) => (
            <div key={question} className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Question {i + 1}</h3>
              <p>{question}</p>
              <RadioGroup className="my-4 ml-4 list-disc [&>div]:mt-2">
                {options.map((option, j) => (
                  <div key={option} className="flex items-center space-x-3">
                    <RadioGroupItem
                      value={j.toString()}
                      id={`option-${i}-${j}`}
                    />
                    <Label htmlFor={`option-${i}-${j}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button className="btn">Generate Another Quiz</Button>
        </CardFooter>
      </Card>
    </main>
  ) : (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Generate a Quiz
      </h2>
      <p className="text-red-500">
        An error occurred while generating the quiz.
      </p>
    </main>
  );
}
