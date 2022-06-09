/* eslint-env node */
module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  parser: '@babel/eslint-parser',
  extends: ['eslint:recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      modules: true,
    },
  },
  rules: {
    'no-empty': ['error', { allowEmptyCatch: true }],
  },
};
