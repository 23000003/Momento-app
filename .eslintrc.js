const react = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');

module.exports = {
    extends: [
        "expo", 
        "plugin:react/jsx-runtime", 
        "plugin:@typescript-eslint/recommended"
    ],
    settings: { react: { version : "detect" }, },
    plugins: [
        "react-refresh", 
        "unused-imports", 
        "@typescript-eslint",
    ],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unused-vars": "error",
      "no-underscore-dangle": [0],
      "react-refresh/only-export-components": ["off"],
      "react-hooks/exhaustive-deps": ["off"],
      "unused-imports/no-unused-imports": "error",
      "plugin:import/recommended": "off",
      ...reactHooks.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
    },
}