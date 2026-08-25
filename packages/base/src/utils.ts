/* eslint-disable unicorn/name-replacements -- utils.ts is a conventional name */
import type { Awaitable, TypedFlatConfigItem } from "./types";

import { isPackageExists } from "local-pkg";

export async function interopDefault<T>(m: Awaitable<T>): Promise<T extends { default: infer U } ? U : T> {
  const resolved = await m;
  return (resolved as any).default || resolved;
}

export function isInEditorEnv(): boolean {
  if (process.env.CI)
    return false;
  if (process.env.GIT_EXEC_PATH)
    return false;
  return !!(process.env.VSCODE_PID || process.env.VSCODE_CWD || process.env.JETBRAINS_IDE || process.env.VIM || process.env.NVIM || process.env.KATE_PID
  );
}

export function renamePluginInConfigs(configs: TypedFlatConfigItem[], map: Record<string, string>): TypedFlatConfigItem[] {
  return configs.map((index) => {
    const clone = { ...index };
    if (clone.rules)
      clone.rules = renameRules(clone.rules, map);
    if (clone.plugins) {
      clone.plugins = Object.fromEntries(
        Object.entries(clone.plugins)
          .map(([key, value]) => {
            if (Object.hasOwn(map, key))
              return [map[key], value];
            return [key, value];
          }),
      );
    }
    return clone;
  });
}

export function renameRules(
  rules: Record<string, any>,
  map: Record<string, string>,
): Record<string, any> {
  return Object.fromEntries(
    Object.entries(rules)
      .map(([key, value]) => {
        for (const [from, to] of Object.entries(map)) {
          if (key.startsWith(`${from}/`))
            return [to + key.slice(from.length), value];
        }
        return [key, value];
      }),
  );
}

export function toArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

export const parserPlain = {
  meta: {
    name: "parser-plain",
  },
  parseForESLint: (code: string) => ({
    ast: {
      body: [],
      comments: [],
      loc: { end: code.length, start: 0 },
      range: [0, code.length],
      tokens: [],
      type: "Program",
    },
    scopeManager: null,
    services: { isPlain: true },
    visitorKeys: {
      Program: [],
    },
  }),
};

export function isPackageInScope(name: string): boolean {
  return isPackageExists(name);
}

export async function ensurePackages(packages: (string | undefined)[]): Promise<void> {
  if (process.env.CI || process.stdout.isTTY === false)
    return;

  const nonExistingPackages = packages.filter(i => i && !isPackageInScope(i)) as string[];
  if (nonExistingPackages.length === 0)
    return;

  // Try to use @clack/prompts if available, otherwise just warn
  try {
    const p = await import("@clack/prompts");
    const result = await p.confirm({
      message: `${nonExistingPackages.length === 1 ? "Package is" : "Packages are"} required for this config: ${nonExistingPackages.join(", ")}. Do you want to install them?`,
    });
    if (result) {
      const { installPackage } = await import("@antfu/install-pkg");
      await installPackage(nonExistingPackages, { dev: true });
    }
  }
  catch {
    console.warn(`[renton] Missing packages: ${nonExistingPackages.join(", ")}. Please install them manually.`);
  }
}
