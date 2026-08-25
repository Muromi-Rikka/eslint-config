/* eslint-disable perfectionist/sort-objects */
import * as p from "@clack/prompts";
import c from "ansis";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import type { ExtraLibrariesOption, FrameworkOption, PromptResult } from "./types";

import { extra, extraOptions, frameworkOptions, frameworks } from "./constants";
import { updateEslintFiles } from "./stages/update-eslint-files";
import { updatePackageJson } from "./stages/update-package-json";
import { updateVscodeSettings } from "./stages/update-vscode-settings";
import { isGitClean } from "./utilities";

export interface CliRunOptions {
  /**
   * Use the extra utils: formatter
   */
  extra?: string[];
  /**
   * Use the framework template: vue / react
   */
  frameworks?: string[];
  /**
   * Skip prompts and use default values
   */
  yes?: boolean;
}

export async function run(options: CliRunOptions = {}): Promise<void> {
  const argumentSkipPrompt = !!process.env.SKIP_PROMPT || options.yes;

  if (fs.existsSync(path.join(process.cwd(), "eslint.config.js"))) {
    p.log.warn(c.yellow`eslint.config.js already exists, migration wizard exited.`);
    return process.exit(1);
  }

  const argumentTemplate = <FrameworkOption[]>options.frameworks?.map(m => m?.trim()).filter(Boolean);
  const argumentExtra = <ExtraLibrariesOption[]>options.extra?.map(m => m?.trim()).filter(Boolean);

  // Set default value for promptResult if `argSkipPrompt` is enabled
  let result: PromptResult = {
    extra: argumentExtra ?? [],
    frameworks: argumentTemplate ?? [],
    uncommittedConfirmed: false,
    updateVscodeSettings: true,
  };

  if (!argumentSkipPrompt) {
    result = await p.group({
      uncommittedConfirmed: () => {
        if (argumentSkipPrompt || isGitClean())
          return Promise.resolve(true);

        return p.confirm({
          initialValue: false,
          message: "There are uncommitted changes in the current repository, are you sure to continue?",
        });
      },
      frameworks: ({ results }) => {
        const isArgumentTemplateValid = typeof argumentTemplate === "string" && !!frameworks.includes(<FrameworkOption>argumentTemplate);

        if (isArgumentTemplateValid || !results.uncommittedConfirmed)
          return;

        const message = !isArgumentTemplateValid && argumentTemplate
          ? `"${argumentTemplate}" isn't a valid template. Please choose from below: `
          : "Select a framework:";

        return p.multiselect<FrameworkOption>({
          message: c.reset(message),
          options: frameworkOptions,
          required: false,
        });
      },
      extra: ({ results }) => {
        const isArgumentExtraValid = argumentExtra?.length && argumentExtra.every(element => extra.includes(<ExtraLibrariesOption>element));

        if (isArgumentExtraValid || !results.uncommittedConfirmed)
          return;

        const message = !isArgumentExtraValid && argumentExtra
          ? `"${argumentExtra}" isn't a valid extra util. Please choose from below: `
          : "Select a extra utils:";

        return p.multiselect<ExtraLibrariesOption>({
          message: c.reset(message),
          options: extraOptions,
          required: false,
        });
      },

      updateVscodeSettings: ({ results }) => {
        if (!results.uncommittedConfirmed)
          return;

        return p.confirm({
          initialValue: true,
          message: "Update .vscode/settings.json for better VS Code experience?",
        });
      },
    }, {
      onCancel: () => {
        p.cancel("Operation cancelled.");
        process.exit(0);
      },
    }) as PromptResult;

    if (!result.uncommittedConfirmed)
      return process.exit(1);
  }

  await updatePackageJson(result);
  await updateEslintFiles(result);
  await updateVscodeSettings(result);

  p.log.success(c.green`Setup completed`);
  p.outro(`Now you can update the dependencies by run ${c.blue("pnpm install")} and run ${c.blue("eslint --fix")}\n`);
}
