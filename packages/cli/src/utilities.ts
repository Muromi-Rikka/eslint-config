import { execSync } from "node:child_process";

export function getEslintConfigContent(
  mainConfig: string,
  additionalConfigs: string[] = [],
): string {
  return `
import { renton } from '@renton/eslint-config'

export default renton({
${mainConfig}
}${additionalConfigs.map(config => `,{\n${config}\n}`)}, {
  // Global ignores must be a standalone config object: an \`ignores\` key next
  // to \`rules\` only applies within that block. Put generated artifacts here
  // (bundles, build output) so ESLint skips them entirely.
  ignores: ['**/dist/**', '**/build/**', '**/coverage/**'],
})
`.trimStart();
}

export function isGitClean(): boolean {
  try {
    execSync("git diff-index --quiet HEAD --");
    return true;
  }
  catch {
    return false;
  }
}
