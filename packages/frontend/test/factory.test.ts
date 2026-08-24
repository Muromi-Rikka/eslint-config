import type { TypedFlatConfigItem } from "@renton/eslint-config";
import { it } from "vitest";
import type { OptionsTailwindcssConfig } from "../src/configs/tailwindcss";
import { tailwindcss } from "../src/configs/tailwindcss";

interface Suite {
  configs: OptionsTailwindcssConfig;
  name: string;
}

const suites: Suite[] = [
  {
    configs: {
      cssConfigPath: "src/app.css",
    },
    name: "tailwindcss",
  },
];

function serializeConfigs(configs: TypedFlatConfigItem[]) {
  return configs.map((c) => {
    const clone = { ...c } as any;
    if (c.plugins) {
      clone.plugins = Object.keys(c.plugins);
    }
    if (c.languageOptions) {
      if (c.languageOptions.parser && typeof c.languageOptions.parser !== "string") {
        clone.languageOptions.parser = (c.languageOptions.parser as any).meta?.name ?? (c.languageOptions.parser as any).name ?? "unknown";
      }
      delete clone.languageOptions.globals;
      if (c.languageOptions.parserOptions) {
        delete clone.languageOptions.parserOptions.parser;
        delete clone.languageOptions.parserOptions.projectService;
        delete clone.languageOptions.parserOptions.tsconfigRootDir;
      }
    }
    if (c.rules) {
      clone.rules = Object.entries(c.rules)
        .map(([rule, value]) => {
          if (value === "off" || value === 0)
            return `- ${rule}`;
          return rule;
        });
    }
    return clone;
  });
}

for (const { configs, name } of suites) {
  it.concurrent(`factory ${name}`, async ({ expect }) => {
    const config = await tailwindcss(configs);
    await expect(serializeConfigs(config))
      .toMatchFileSnapshot(`./__snapshots__/${name}.snap.js`);
  });
}
