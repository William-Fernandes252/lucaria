import { Config } from "effect";

/**
 * AWS configuration.
 */
export class AWSConfig {
  constructor(
    readonly accessKeyId: string,
    readonly secretAccessKey: string,
    readonly region: string,
  ) {}
}

const awsConfig = Config.map(
  Config.all([
    Config.string("AWS_ACCESS_KEY_ID"),
    Config.string("AWS_SECRET_ACCESS_KEY"),
    Config.string("AWS_REGION"),
  ]),
  ([accessKeyId, secretAccessKey, region]) =>
    new AWSConfig(accessKeyId, secretAccessKey, region),
);

export default awsConfig;
