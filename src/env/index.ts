import { createLogger } from "../logger";
import { EnvType as GenericEnvType } from "./types";

const REQUIRED_ENV_KEYS = [
  "APPLICATION_ID",
  "APPLICATION_SECRET",
  "TEST_CHANNEL_ID",

  "PGUSER",
  "PGHOST",
  "PGDATABASE",
  "PGPASSWORD",
  "PGPORT",

  "EXPRESS_PORT",
] as const;
type EnvType = GenericEnvType<typeof REQUIRED_ENV_KEYS>;
const logger = createLogger("env");

const parseEnv = () => {
  const providedVars = Object.keys(process.env);

  const env: Partial<EnvType> = {};

  for (const requiredVar of REQUIRED_ENV_KEYS) {
    if (!providedVars.includes(requiredVar)) {
      logger.error(`Environment variable '${requiredVar}' not provided.`);
      logger.error(
        `Required environment variables are [${REQUIRED_ENV_KEYS.join(", ")}]`,
      );
      process.exit(-1);
    }

    env[requiredVar] = process.env[requiredVar] as string;
  }

  return env as EnvType;
};

export const env = parseEnv();
