export type ExtraLibrariesOption = "formatter";

export type FrameworkOption = "react" | "vue";

export interface PromItem<T> {
  hint?: string;
  label: string;
  value: T;
}

export interface PromptResult {
  extra: ExtraLibrariesOption[];
  frameworks: FrameworkOption[];
  uncommittedConfirmed: boolean;
  updateVscodeSettings: unknown;
}
