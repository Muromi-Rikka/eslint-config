import type { TypedFlatConfigItem } from "@renton/eslint-config";
import { it } from "vitest";
import type { OptionsVue } from "../src/types";
import { rentonVue } from "../src/factory";

interface Suite {
  configs: OptionsVue;
  name: string;
}

const suites: Suite[] = [
  {
    configs: {},
    name: "default",
  },
  {
    configs: {
      vueVersion: 2,
    },
    name: "vue2",
  },
  {
    configs: {
      tailwindcss: true,
      tailwindcssConfigPath: "src/app.css",
    },
    name: "with-tailwindcss",
  },
  {
    configs: {
      vueI18n: true,
    },
    name: "with-vue-i18n",
  },
];

const ignoreConfigs: Set<string> = new Set([
  "renton/gitignore",
  "renton/ignores",
  "renton/javascript/setup",
]);

function serializeConfigs(configs: TypedFlatConfigItem[]) {
  return configs.map((c) => {
    if (c.name && ignoreConfigs.has(c.name)) {
      return "<ignored>";
    }
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
    if (c.processor && typeof c.processor !== "string") {
      clone.processor = (c.processor as any).meta?.name ?? "unknown";
    }
    if (c.rules) {
      clone.rules = Object.entries(c.rules)
        .map(([rule, value]) => {
          if (value === "off" || value === 0)
            return `- ${rule}`;
          return rule;
        })
        .sort();
    }
    return clone;
  });
}

for (const { configs, name } of suites) {
  it.concurrent(`factory ${name}`, async ({ expect }) => {
    const config = await rentonVue(configs);
    await expect(serializeConfigs(config))
      .toMatchFileSnapshot(`./__snapshots__/${name}.snap.js`);
  });
}
