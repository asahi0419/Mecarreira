module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'prettier', 'react-hooks'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended'
  ],
  root: true,
  env: {
    node: true,
    jest: true
  },
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/semi': ['off', null],
    '@typescript-eslint/array-type': [
      'error',
      {
        'default': 'array'
      }
    ],
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-empty-function': 'error',
    '@typescript-eslint/no-misused-new': 'error',
    '@typescript-eslint/no-var-requires': 'error',
    'react-hooks/exhaustive-deps': 0,
    'curly': ['error', 'multi-line'],
    'eqeqeq': ['error', 'smart'],
    'max-len': ['warn', { 'code': 160 }],
    'no-duplicate-case': 'error',
    'no-unused-vars': 'warn',
    'object-curly-spacing': ['error', 'always'],
    // 'object-shorthand': 'error',
    'no-extra-semi': 'off',
    'react-hooks/rules-of-hooks': 'off',
    'prettier/prettier': [
      'error',
      {
        'endOfLine': 'auto'
      },
      {
        'usePrettierrc': true
      }
    ]
  },
  ignorePatterns: ['.eslintrc.js', 'craco.config.js', 'tsconfig-paths-bootstrap.js', 'node_modules/', '**/types/**/*']
}
