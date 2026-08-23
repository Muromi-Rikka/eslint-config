import type { Linter } from 'eslint'

import type { TypedFlatConfigItem } from '@renton/eslint-config'

// Make sure they are compatible
((): Linter.Config => ({} as TypedFlatConfigItem))();
((): TypedFlatConfigItem => ({} as Linter.Config))()
