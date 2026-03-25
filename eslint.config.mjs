import globals from 'globals'
import pluginJs from '@eslint/js'
import tsEslint from 'typescript-eslint'
import tsEslintParser from '@typescript-eslint/parser'
import eslintConfigPrettier from 'eslint-config-prettier'
import vitest from '@vitest/eslint-plugin'

export default [
  { files: ['**/*.{js,ts}'] },
  { languageOptions: { globals: globals.node, parser: tsEslintParser } },
  pluginJs.configs.recommended,
  ...tsEslint.configs.recommended,
  ...tsEslint.configs.stylistic,
  {
    ignores: ['.env', 'coverage', '**/dist', 'reports', 'eslint.config.mjs']
  },
  {
    files: ['**/*.spec.ts'],
    plugins: { vitest: vitest },
    rules: {
      ...vitest.configs.recommended.rules
    }
  },
  {
    rules: {
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: true,
          caughtErrors: 'none'
        }
      ]
    }
  },
  eslintConfigPrettier
]
