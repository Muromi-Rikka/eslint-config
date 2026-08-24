import type { TypedFlatConfigItem } from "@renton/eslint-config";
import type { Linter } from "eslint";

// Make sure they are compatible
((): Linter.Config => ({} as TypedFlatConfigItem))(); // eslint-disable-line unicorn/no-unreadable-iife -- type compatibility check
((): TypedFlatConfigItem => ({} as Linter.Config))(); // eslint-disable-line unicorn/no-unreadable-iife -- type compatibility check
