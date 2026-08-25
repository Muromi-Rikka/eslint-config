export interface PromItem<T> {
  label: string;
  value: T;
  hint?: string;
}

export type FrameworkOption = "vue" | "react";

export type ExtraLibrariesOption = "formatter";

export interface PromptResult {
  uncommittedConfirmed: boolean;
  frameworks: FrameworkOption[];
  extra: ExtraLibrariesOption[];
  updateVscodeSettings: unknown;
}
