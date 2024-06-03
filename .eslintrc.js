module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "airbnb-base",
    "airbnb/rules/react",
    "plugin:react/recommended",
  ],
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
    project: ['./tsconfig.json']
  },
  rules: {
    "no-use-before-define": "off",
    "react/jsx-uses-react": 2,
    "jsx-quotes": ["error", "prefer-double"],
    "react/jsx-max-props-per-line": ["error", { maximum: 2 }],
    "max-len": ["error", { code: 120 }],
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "react/jsx-filename-extension": ["error", { extensions: [".ts", ".tsx"] }],
    "react/jsx-no-bind": "off",
    // "react/function-component-definition": [2, { "namedComponents": "arrow-function" }],
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      },
    ],
    "import/no-unresolved": "off",
    "react/jsx-props-no-spreading": [
      1,
      {
        html: "enforce",
        custom: "ignore",
      },
    ],
    "react/require-default-props": "off",
    "react/destructuring-assignment": "off",
    "@typescript-eslint/no-misused-promises": "off",
    "no-undef": "off",
    "no-shadow": "off",
    "react/prop-types": 0,
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
    "import/prefer-default-export": "off",
    "max-len": 'off',
    camelcase: 'off',
    'no-param-reassign': 'off',
    "prefer-arrow-callback": 'off',
  },
  settings: {
    react: {
      version: "detect", 
    },
    "import/resolver": {
      alias: {
        map: [
          ["@", "./src"],
          ["assets", "./src/assets"],
          ["configs", "./src/configs"],
        ],
        extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
      },
    },
  },
};
