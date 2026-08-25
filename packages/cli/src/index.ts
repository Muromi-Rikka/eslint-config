import process from "node:process";

import * as p from "@clack/prompts";
import c from "ansis";
import { cac } from "cac";

import { run } from "./run";

function header(): void {
  console.log("\n");
  p.intro(`${c.green`@renton/eslint-config `}${c.dim`CLI`}`);
}

const cli = cac("renton-eslint");

cli
  .command("", "Run the initialization or migration")
  .option("--yes, -y", "Skip prompts and use default values", { default: false })
  .option("--template, -t <template>", "Use the framework template: vue / react", { type: [] })
  .option("--extra, -e <extra>", "Use the extra utils: formatter", { type: [] })
  .action(async (args) => {
    header();
    try {
      await run(args);
    }
    catch (error) {
      p.log.error(c.inverse.red(" Failed to migrate "));
      p.log.error(c.red`✘ ${String(error)}`);
      process.exit(1);
    }
  });

cli.help();
cli.parse();
