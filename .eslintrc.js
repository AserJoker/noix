module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: ['standard'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'space-before-function-paren': 'off',
    semi: 'off',
    indent: 'off'
  },
  settings: {}
};
