import { renton } from "@renton/eslint-config";

export default renton(
  {},
  {
    ignores: ["reference/**", "test/fixtures/**"],
  },
);
