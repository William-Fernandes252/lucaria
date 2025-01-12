import { PrismaAdapter } from "@auth/prisma-adapter";
import { Effect } from "effect";
import NextAuth from "next-auth";
import { PrismaClientProvider, PrismaClientProviderLive } from "./lib/prisma";

const initializer = Effect.provide(
  Effect.gen(function* () {
    const prismaProvider = yield* PrismaClientProvider;
    const prisma = yield* prismaProvider.client;
    return NextAuth({
      adapter: PrismaAdapter(prisma),
      providers: [],
    });
  }),
  PrismaClientProviderLive,
);

export const { handlers, signIn, signOut, auth } = Effect.runSync(initializer);
