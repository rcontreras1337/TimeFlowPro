module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Tipo obligatorio
    'type-enum': [
      2,
      'always',
      [
        'feat', // Nueva funcionalidad
        'fix', // Corrección de bug
        'docs', // Documentación
        'style', // Formateo, sin cambios de código
        'refactor', // Refactorización
        'perf', // Mejora de rendimiento
        'test', // Tests
        'chore', // Mantenimiento
        'ci', // CI/CD
        'revert', // Revertir commit
      ],
    ],
    // Subject en minúscula
    'subject-case': [2, 'always', 'sentence-case'],
    // Máximo 72 caracteres en header
    'header-max-length': [2, 'always', 72],
    // Body con línea en blanco después del header
    'body-leading-blank': [2, 'always'],
    // Footer con línea en blanco antes
    'footer-leading-blank': [2, 'always'],
  },
  helpUrl: 'https://www.conventionalcommits.org/',
}
