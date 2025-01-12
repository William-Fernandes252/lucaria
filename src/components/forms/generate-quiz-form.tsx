"use client";

import {
  type Input as GenerationInput,
  InputSchema as GenerationInputSchema,
} from "@/lib/messages";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

type GenerateQuizFormProps = {
  /**
   * The submit handler.
   *
   * The default handler will submit the form.
   *
   * @param data The form data.
   * @param event The form event.
   */
  onSubmit?: SubmitHandler<GenerationInput>;

  /**
   * The form action.
   */
  action?: React.FormHTMLAttributes<HTMLFormElement>["action"];

  /**
   * The form method.
   */
  method?: React.FormHTMLAttributes<HTMLFormElement>["method"];
};

export default function GenerateQuizForm({
  onSubmit = (_, event) => event?.target.submit(),
  action,
  method = "GET",
}: GenerateQuizFormProps) {
  const form = useForm<GenerationInput>({
    resolver: zodResolver(GenerationInputSchema),
    defaultValues: {
      questions: 10,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        action={action}
        method={method}
      >
        <div className="container flex flex-col gap-4 w-80 justify-between">
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Input</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Enter a theme, a list of keywords, a text content..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="questions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Questions</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    placeholder="The number of questions for the quiz"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Generate</Button>
        </div>
      </form>
    </Form>
  );
}
