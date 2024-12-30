import { Config } from "effect";

export { default as awsConfig } from "./aws";

export { default as databaseConfig } from "./database";

export { nodeEnv } from "./runtime";

export const authSecret = Config.string("AUTH_SECRET");
