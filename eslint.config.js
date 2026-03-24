import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import prettier from 'eslint-config-prettier'
import globals from 'globals'

const tsRules = {
  ...tsPlugin.configs.recommended.rules,
  '@typescript-eslint/no-explicit-any': 'warn',
  '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
}

export default [
  js.configs.recommended,

  // TypeScript files
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      globals: { ...globals.browser, ...globals.es2022 },
    },
    plugins: { '@typescript-eslint': tsPlugin },
    rules: tsRules,
  },

  // Vue files (vue-eslint-parser is set automatically by flat/recommended)
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: ['.vue'],
      },
      globals: { ...globals.browser, ...globals.es2022 },
    },
    plugins: { '@typescript-eslint': tsPlugin },
    rules: {
      ...tsRules,
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'error',
      'vue/require-default-prop': 'off',
    },
  },

  // Ignore
  {
    ignores: ['dist/**', 'node_modules/**', 'public/**'],
  },

  prettier,
]
