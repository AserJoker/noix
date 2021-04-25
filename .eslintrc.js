module.exports = {
  env: {
    browser: true,
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
    indent: 'off',
    'no-useless-constructor': 'off',
    'keyword-spacing': 'off'
  },
  settings: {}
};
