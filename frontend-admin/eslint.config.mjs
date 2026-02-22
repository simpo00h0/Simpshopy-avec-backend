import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['.next/**', 'node_modules/**'] },
  js.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
];
