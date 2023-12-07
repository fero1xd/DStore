import "dotenv/config";
import { main } from "./main";

main().catch((err) => {
  console.log(err);

  console.log("💥 Unhandled Exception");
});
