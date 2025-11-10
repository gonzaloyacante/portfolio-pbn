module.exports = {
  root: true,
  extends: [
    'next/core-web-vitals',
    'plugin:jsx-a11y/recommended',
  ],
  rules: {
    // Ajustes graduales: no bloquear el build mientras migramos
    '@next/next/no-img-element': 'off',
  },
}
