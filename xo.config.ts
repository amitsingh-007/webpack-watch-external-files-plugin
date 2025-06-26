// @ts-expect-error TODO to fix
import { type FlatXoConfig } from 'xo';

const xoConfig: FlatXoConfig = [
  {
    prettier: true,
    space: true,
  },
  {
    rules: {
      'no-async-promise-executor': 'off',
      'import-x/extensions': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/prefer-promise-reject-errors': 'off',
      'unicorn/no-array-reduce': 'off',
    },
  },
];

export default xoConfig;
