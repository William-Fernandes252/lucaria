import { Config } from "effect";

/**
 * Database configuration.
 */
export class DatabaseConfig {
  constructor(
    readonly url: string,
    readonly directUrl: string,
  ) {}
}

const databaseConfig = Config.map(
  Config.all([Config.string("DATABASE_URL"), Config.string("DIRECT_URL")]),
  ([url, directUrl]) => new DatabaseConfig(url, directUrl),
);

export default databaseConfig;
