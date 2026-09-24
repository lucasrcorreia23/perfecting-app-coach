// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

/**
 * Guardrails do grid 4/8: proíbe valores arbitrários do Tailwind e números
 * soltos em style. Medidas vêm de theme/tokens.ts. Complementa scripts/audit-scale.ts.
 */
const gridRules = {
  'no-restricted-syntax': [
    'error',
    {
      selector: "JSXAttribute[name.name=/[cC]lassName$/] Literal[value=/-\\[[^\\]]+\\]/]",
      message: 'Valor arbitrário do Tailwind proibido. Use a escala de theme/tokens.ts.',
    },
    {
      selector: "JSXAttribute[name.name=/[cC]lassName$/] TemplateElement[value.raw=/-\\[[^\\]]+\\]/]",
      message: 'Valor arbitrário do Tailwind proibido. Use a escala de theme/tokens.ts.',
    },
    {
      selector:
        "JSXAttribute[name.name=/^(style|contentContainerStyle)$/] ObjectExpression > Property > Literal[raw=/^-?[1-9]/]",
      message: 'Número solto em style. Use spacing/sizes de theme/tokens.ts.',
    },
  ],
};

module.exports = defineConfig([
  expoConfig,
  {
    files: ['app/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}', 'features/**/*.{ts,tsx}'],
    rules: gridRules,
  },
  {
    ignores: ['dist/*', 'screenshots/*', 'components/logo-paths.ts'],
  },
]);
