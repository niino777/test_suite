module.exports = {
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/tests/unit/setup.js'],
  testMatch: ['**/tests/unit/**/*.spec.js'],
  moduleFileExtensions: ['js', 'mjs', 'json', 'vue'],
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\.m?js$': 'babel-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    // Jest 27 no entiende el campo "exports" de los paquetes: indicamos la ruta de forma directa
    '^vuetify/components$': '<rootDir>/node_modules/vuetify/lib/components/index.mjs',
    '^vuetify/directives$': '<rootDir>/node_modules/vuetify/lib/directives/index.mjs',
    '^axios$': '<rootDir>/node_modules/axios/dist/node/axios.cjs',
    '\\.css$': '<rootDir>/tests/unit/fileMock.js'
  },
  // Vuetify se distribuye como ESM, por eso Jest debe transformarlo
  transformIgnorePatterns: ['/node_modules/(?!vuetify)']
}
