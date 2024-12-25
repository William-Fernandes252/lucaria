import { config } from "@/config";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  log: config.NODE_ENV === "development" ? ["query"] : [],
});
