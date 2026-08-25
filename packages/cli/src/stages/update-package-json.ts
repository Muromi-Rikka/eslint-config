import * as p from "@clack/prompts";
import c from "ansis";
import fsp from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import type { ExtraLibrariesOption, PromptResult } from "../types";

import { dependenciesMap } from "../constants";

export async function updatePackageJson(result: PromptResult): Promise<void> {
  const cwd = process.cwd();

  const pathPackageJSON = path.join(cwd, "package.json");

  p.log.step(c.cyan`Updating package.json with @renton/eslint-config`);

  const packageContent = await fsp.readFile(pathPackageJSON, "utf8");
  const package_: Record<string, any> = JSON.parse(packageContent);

  package_.devDependencies ??= {};
  package_.devDependencies["@renton/eslint-config"] = `^latest`;
  package_.devDependencies.eslint ??= `^10.0.0`;

  const addedPackages: string[] = [];

  function addDependencies(dependencies: readonly (string | undefined)[]): void {
    for (const dependency of dependencies) {
      if (!dependency)
        continue;
      package_.devDependencies[dependency] = `^latest`;
      addedPackages.push(dependency);
    }
  }

  if (result.extra.length > 0) {
    for (const item of result.extra as ExtraLibrariesOption[]) {
      if (item === "formatter")
        addDependencies(dependenciesMap.formatter);
    }
  }

  for (const framework of result.frameworks) {
    const dependencies = dependenciesMap[framework];
    if (dependencies)
      addDependencies(dependencies);
  }

  if (addedPackages.length > 0)
    p.note(c.dim(addedPackages.join(", ")), "Added packages");

  await fsp.writeFile(pathPackageJSON, JSON.stringify(package_, null, 2));
  p.log.success(c.green`Changes wrote to package.json`);
}
