import * as p from "@clack/prompts";
import c from "ansis";
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import type { PromptResult } from "../types";

import { getEslintConfigContent } from "../utilities";

const ESLINT_OR_PRETTIER = /eslint|prettier/;
const ESLINT_CONFIG = /eslint\.config\./;

export async function updateEslintFiles(result: PromptResult): Promise<void> {
  const cwd = process.cwd();
  const pathPackageJSON = path.join(cwd, "package.json");

  const packageContent = await fsp.readFile(pathPackageJSON, "utf8");
  const package_: Record<string, any> = JSON.parse(packageContent);

  const configFileName = package_.type === "module" ? "eslint.config.js" : "eslint.config.mjs";
  const pathFlatConfig = path.join(cwd, configFileName);

  const configLines: string[] = [];

  if (result.extra.includes("formatter"))
    configLines.push(`formatters: true,`);

  for (const framework of result.frameworks)
    configLines.push(`${framework}: true,`);

  const mainConfig = configLines.map(index => `  ${index}`).join("\n");
  const additionalConfig: string[] = [];

  const eslintConfigContent: string = getEslintConfigContent(mainConfig, additionalConfig);

  await fsp.writeFile(pathFlatConfig, eslintConfigContent);
  p.log.success(c.green`Created ${configFileName}`);

  const files = fs.readdirSync(cwd);
  const legacyConfig: string[] = [];
  for (const file of files) {
    if (ESLINT_OR_PRETTIER.test(file) && !ESLINT_CONFIG.test(file))
      legacyConfig.push(file);
  }

  if (legacyConfig.length > 0)
    p.note(c.dim(legacyConfig.join(", ")), "You can now remove those files manually");
}
