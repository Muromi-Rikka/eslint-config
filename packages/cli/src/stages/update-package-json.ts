import type { ExtraLibrariesOption, PromptResult } from "../types";
import fsp from "node:fs/promises";
import path from "node:path";

import process from "node:process";
import * as p from "@clack/prompts";

import c from "ansis";

import { dependenciesMap } from "../constants";

export async function updatePackageJson(result: PromptResult): Promise<void> {
  const cwd = process.cwd();

  const pathPackageJSON = path.join(cwd, "package.json");

  p.log.step(c.cyan`Updating package.json with @renton/eslint-config`);

  const pkgContent = await fsp.readFile(pathPackageJSON, "utf-8");
  const pkg: Record<string, any> = JSON.parse(pkgContent);

  pkg.devDependencies ??= {};
  pkg.devDependencies["@renton/eslint-config"] = `^latest`;
  pkg.devDependencies.eslint ??= `^10.0.0`;

  const addedPackages: string[] = [];

  if (result.extra.length) {
    result.extra.forEach((item: ExtraLibrariesOption) => {
      switch (item) {
        case "formatter":
          dependenciesMap.formatter.forEach((f) => {
            if (!f)
              return;
            pkg.devDependencies[f] = `^latest`;
            addedPackages.push(f);
          });
          break;
      }
    });
  }

  for (const framework of result.frameworks) {
    const deps = dependenciesMap[framework];
    if (deps) {
      deps.forEach((f) => {
        pkg.devDependencies[f] = `^latest`;
        addedPackages.push(f);
      });
    }
  }

  if (addedPackages.length)
    p.note(c.dim(addedPackages.join(", ")), "Added packages");

  await fsp.writeFile(pathPackageJSON, JSON.stringify(pkg, null, 2));
  p.log.success(c.green`Changes wrote to package.json`);
}
