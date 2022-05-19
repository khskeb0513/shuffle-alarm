const dotenv = require("dotenv");
const cli = require("next/dist/cli/next-start");

dotenv.config();

if (!process.env.PORT) {
  console.error("no port specified");
  process.exit(1);
}

cli.nextStart(["-p", process.env.PORT]);
