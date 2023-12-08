import "dotenv/config";
import { main } from "./main";
import { createLogger } from "./logger";
import { env } from "./env";

const logger = createLogger("global");

logger.info(`${Object.keys(env).length} Environemnt variables loaded`);

main().catch((err) => {
  console.log(err);

  logger.error("Unhandled Exception");
  process.exit(-1);
});
