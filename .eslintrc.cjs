module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react/recommended', // <--- 追記
    'plugin:react/jsx-runtime',
    'prettier',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/prop-types': 'off',
    // '@typescript-eslint/naming-convention': [
    //   'error',
    //   {
    //     selector: 'variable',
    //     format: ['camelCase'],
    //   },
    //   {
    //     selector: 'function',
    //     format: ['camelCase', 'PascalCase'],
    //   },
    //   {
    //     selector: 'parameter',
    //     format: ['camelCase'],
    //   },
    //   {
    //     selector: 'class',
    //     format: ['PascalCase'],
    //   },
    //   {
    //     selector: 'method',
    //     format: ['camelCase'],
    //   },
    //   {
    //     selector: 'property',
    //     format: ['camelCase'],
    //   },
    //   {
    //     selector: 'interface',
    //     format: ['PascalCase'],
    //   },
    //   {
    //     selector: 'typeAlias',
    //     format: ['PascalCase'],
    //   },
    //   {
    //     selector: 'typeParameter',
    //     format: ['camelCase'],
    //   },
    //   {
    //     selector: 'enum',
    //     format: ['PascalCase'],
    //   },
    //   {
    //     selector: 'enumMember',
    //     format: ['UPPER_CASE'],
    //   },
    // ],
  },
}
