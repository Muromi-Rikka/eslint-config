/* eslint-disable command/command, unicorn/no-useless-spread -- ported verbatim from antfu eslint-config; the ...[] spreads are the @keep-sorted units and must stay */
import { findUp } from "find-up-simple";
import fs from "node:fs/promises";
import type { OptionsPnpm, TypedFlatConfigItem } from "../types";
import { interopDefault } from "../utils";

export async function pnpm(options: OptionsPnpm = {}): Promise<TypedFlatConfigItem[]> {
  const [
    pluginPnpm,
    pluginYaml,
    pluginJsoncParser,
    yamlParser,
  ] = await Promise.all([
    interopDefault(import("eslint-plugin-pnpm")),
    interopDefault(import("eslint-plugin-yml")),
    interopDefault(import("jsonc-eslint-parser")),
    interopDefault(import("yaml-eslint-parser")),
  ]);

  const {
    catalogs = await hasCatalogUsage(),
    isInEditor = false,
    json = true,
    sort = true,
    stylistic = true,
    yaml = true,
  } = options;

  const configs: TypedFlatConfigItem[] = [];

  if (json) {
    configs.push({
      files: [
        "package.json",
        "**/package.json",
      ],
      languageOptions: {
        parser: pluginJsoncParser,
      },
      name: "renton/pnpm/package-json",
      plugins: {
        pnpm: pluginPnpm,
      },
      rules: {
        ...(catalogs && {
          "pnpm/json-enforce-catalog": [
            "error",
            {
              autofix: !isInEditor,
            },
          ],
        }),
        "pnpm/json-prefer-workspace-settings": [
          "error",
          { autofix: !isInEditor },
        ],
        "pnpm/json-valid-catalog": [
          "error",
          { autofix: !isInEditor },
        ],
      },
    });
  }

  if (yaml) {
    configs.push({
      files: ["pnpm-workspace.yaml"],
      languageOptions: {
        parser: yamlParser,
      },
      name: "renton/pnpm/pnpm-workspace-yaml",
      plugins: {
        pnpm: pluginPnpm,
      },
      rules: {
        "pnpm/yaml-enforce-settings": ["error", {
          settings: {
            minimumReleaseAgeExcludePrune: true,
            shellEmulator: true,
            trustPolicy: "no-downgrade",
          },
        }],
        "pnpm/yaml-no-duplicate-catalog-item": "error",
        "pnpm/yaml-no-unused-catalog-item": "error",
      },
    });

    if (stylistic) {
      configs.push({
        files: ["pnpm-workspace.yaml"],
        languageOptions: {
          parser: yamlParser,
        },
        name: "renton/pnpm/pnpm-workspace-yaml-stylistic",
        plugins: {
          pnpm: pluginPnpm,
        },
        rules: {
          "pnpm/yaml-blank-lines": "error",
        },
      });
    }

    if (sort) {
      configs.push({
        files: ["pnpm-workspace.yaml"],
        languageOptions: {
          parser: yamlParser,
        },
        name: "renton/pnpm/pnpm-workspace-yaml-sort",
        plugins: {
          yaml: pluginYaml,
        },
        rules: {
          "yaml/sort-keys": [
            "error",
            {
              order: [
                // Workspace
                // @keep-sorted
                ...[
                  "dedupeInjectedDeps",
                  "disallowWorkspaceCycles",
                  "failIfNoMatch",
                  "ignoreWorkspaceCycles",
                  "ignoreWorkspaceRootCheck",
                  "includeWorkspaceRoot",
                  "injectWorkspacePackages",
                  "legacyDirFiltering",
                  "linkWorkspacePackages",
                  "preferWorkspacePackages",
                  "saveWorkspaceProtocol",
                  "sharedWorkspaceLockfile",
                  "syncInjectedDepsAfterScripts",
                ],

                // Catalogs
                // @keep-sorted
                ...[
                  "catalogMode",
                  "catalogPrune",
                  "cleanupUnusedCatalogs",
                ],

                // Dependency resolution
                // @keep-sorted
                ...[
                  "allowedDeprecatedVersions",
                  "blockExoticSubdeps",
                  "ignoredOptionalDependencies",
                  "minimumReleaseAge",
                  "minimumReleaseAgeIgnoreMissingTime",
                  "minimumReleaseAgeStrict",
                  "minimumReleaseAgeExcludePrune",
                  "minimumReleaseAgeExclude",
                  "registrySupportsTimeField",
                  "resolutionMode",
                  "supportedArchitectures",
                  "trustLockfile",
                  "trustPolicy",
                  "trustPolicyIgnoreAfter",
                  "trustPolicyExclude",
                  "update",
                ],

                // Peer dependencies
                // @keep-sorted
                ...[
                  "autoInstallPeers",
                  "dedupePeerDependents",
                  "dedupePeers",
                  "peerDependencyRules",
                  "resolvePeersFromWorkspaceRoot",
                  "strictPeerDependencies",
                ],

                // Registry and network
                // @keep-sorted
                ...[
                  "fetchMinSpeedKiBps",
                  "fetchRetries",
                  "fetchRetryFactor",
                  "fetchRetryMaxtimeout",
                  "fetchRetryMintimeout",
                  "fetchTimeout",
                  "fetchWarnTimeoutMs",
                  "gitShallowHosts",
                  "httpProxy",
                  "httpsProxy",
                  "localAddress",
                  "maxsockets",
                  "namedRegistries",
                  "networkConcurrency",
                  "noProxy",
                  "registries",
                  "registry",
                  "strictSsl",
                ],

                // node_modules
                // @keep-sorted
                ...[
                  "dlxCacheMaxAge",
                  "enableGlobalVirtualStore",
                  "enableModulesDir",
                  "extendNodePath",
                  "modulesCacheMaxAge",
                  "modulesDir",
                  "nodeExperimentalPackageMap",
                  "nodeLinker",
                  "nodePackageMapType",
                  "packageImportMethod",
                  "preferSymlinkedExecutables",
                  "symlink",
                  "virtualStoreDir",
                  "virtualStoreDirMaxLength",
                  "virtualStoreOnly",
                  "virtualStoreType",
                ],

                // Hoisting
                // @keep-sorted
                ...[
                  "hoist",
                  "hoistingLimits",
                  "hoistPattern",
                  "hoistWorkspacePackages",
                  "publicHoistPattern",
                  "shamefullyHoist",
                ],

                // Store
                // @keep-sorted
                ...[
                  "frozenStore",
                  "storeDir",
                  "strictStorePkgContentCheck",
                  "useRunningStoreServer",
                  "verifyStoreIntegrity",
                ],

                // Lockfile
                // @keep-sorted
                ...[
                  "gitBranchLockfile",
                  "lockfile",
                  "lockfileIncludeTarballUrl",
                  "mergeGitBranchLockfilesBranchPattern",
                  "peersSuffixMaxLength",
                  "preferFrozenLockfile",
                ],

                // Scripts and builds
                // @keep-sorted
                ...[
                  "childConcurrency",
                  "dangerouslyAllowAllBuilds",
                  "enablePrePostScripts",
                  "ignoreDepScripts",
                  "ignoreScripts",
                  "nodeOptions",
                  "requiredScripts",
                  "scriptShell",
                  "shellEmulator",
                  "sideEffectsCache",
                  "sideEffectsCacheReadonly",
                  "strictDepBuilds",
                  "unsafePerm",
                  "verifyDepsBeforeRun",
                ],

                // Node.js and package manager versions
                // @keep-sorted
                ...[
                  "managePackageManagerVersions",
                  "nodeDownloadMirrors",
                  "nodeVersion",
                  "packageManagerStrict",
                  "packageManagerStrictVersion",
                  "pmOnFail",
                  "runtimeOnFail",
                ],

                // CLI and output
                // @keep-sorted
                ...[
                  "ci",
                  "color",
                  "engineStrict",
                  "loglevel",
                  "npmPath",
                  "recursiveInstall",
                  "updateNotifier",
                  "useBetaCli",
                  "useStderr",
                ],

                // Directories and pnpmfile
                // @keep-sorted
                ...[
                  "cacheDir",
                  "globalBinDir",
                  "globalDir",
                  "globalPnpmfile",
                  "globalShims",
                  "ignorePnpmfile",
                  "npmrcAuthFile",
                  "pnpmfile",
                  "stateDir",
                ],

                // Audit and versioning
                // @keep-sorted
                ...[
                  "audit",
                  "versioning",
                ],

                // Misc
                // @keep-sorted
                ...[
                  "allowNonAppliedPatches",
                  "dedupeDirectDeps",
                  "deployAllFiles",
                  "ignoreCompatibilityDb",
                  "initAuthorEmail",
                  "initAuthorName",
                  "initAuthorUrl",
                  "initLicense",
                  "initVersion",
                  "optimisticRepeatInstall",
                  "saveExact",
                  "savePrefix",
                  "tag",
                ],

                // Workspace layout and dependency declarations, ordered by how
                // a `pnpm-workspace.yaml` usually reads top to bottom
                "packages",
                "packageConfigs",
                "overrides",
                "packageExtensions",
                "patchedDependencies",
                "configDependencies",

                // Build approvals
                "allowBuilds",
                // Superseded by `allowBuilds` in pnpm v11
                // @keep-sorted
                ...[
                  "ignoredBuiltDependencies",
                  "neverBuiltDependencies",
                  "onlyBuiltDependencies",
                  "onlyBuiltDependenciesFile",
                ],

                // Catalogs, usually the largest blocks
                "catalog",
                "catalogs",
              ],
              pathPattern: "^$",
            },
            {
              order: { type: "asc" },
              pathPattern: ".*",
            },
          ],
        },
      });
    }
  }

  return configs;
}

async function hasCatalogUsage(): Promise<boolean> {
  const workspaceFile = await findUp("pnpm-workspace.yaml");
  if (!workspaceFile)
    return false;

  const content = await fs.readFile(workspaceFile, "utf8");
  return content.includes("catalog:") || content.includes("catalogs:");
}
