module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser

  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    'plugin:prettier/recommended' // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    project: './tsconfig.json',
    sourceType: 'module' // Allows for the use of imports
  },
  rules: {
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/no-parameter-properties': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off'
  }
};
