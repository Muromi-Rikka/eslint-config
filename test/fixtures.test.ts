import type { OptionsConfig, TypedFlatConfigItem } from "@renton/eslint-config";

import fs from "node:fs/promises";
import { join, resolve } from "node:path"; // eslint-disable-line unicorn/import-style -- named imports are clearer here
import { x } from "tinyexec";
import { glob } from "tinyglobby";
import { afterAll, beforeAll, it } from "vitest";

const isWindows = process.platform === "win32";
const timeout = isWindows ? 300_000 : 60_000;

beforeAll(async () => {
  await fs.rm("_fixtures", { force: true, recursive: true });
});
afterAll(async () => {
  await fs.rm("_fixtures", { force: true, recursive: true });
});

runWithConfig("js", {
  typescript: false,
});

runWithConfig("ts", {
  typescript: true,
});

runWithConfig("ts-strict", {
  typeAware: true,
  typescript: true,
});

function runWithConfig(name: string, configs: OptionsConfig, ...items: TypedFlatConfigItem[]) {
  it.concurrent(name, async ({ expect }) => {
    const from = resolve("test/fixtures/input");
    const output = resolve("test/fixtures/output", name);
    const target = resolve("_fixtures", name);

    await fs.cp(from, target, {
      filter: (source) => {
        return !source.includes("node_modules");
      },
      recursive: true,
    });
    await fs.writeFile(join(target, "eslint.config.js"), `
// @eslint-disable
import { renton } from '@renton/eslint-config'

export default renton(
  ${JSON.stringify(configs)},
  ...${JSON.stringify(items) ?? []},
)
  `);

    await x("npx", ["eslint", ".", "--fix"], {
      nodeOptions: {
        cwd: target,
        stdio: "pipe",
      },
      throwOnError: false,
    });

    const files = await glob("**/*", {
      cwd: target,
      ignore: [
        "node_modules",
        "eslint.config.js",
      ],
    });

    await Promise.all(files.map(async (file) => {
      const content = await fs.readFile(join(target, file), "utf8");
      const source = await fs.readFile(join(from, file), "utf8");
      const outputPath = join(output, file);
      if (content === source) {
        await fs.rm(outputPath, { force: true });
        return;
      }
      await expect.soft(content).toMatchFileSnapshot(join(output, file));
    }));
  }, timeout);
}
