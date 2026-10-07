// jsdom no incluye algunas APIs del navegador que Vuetify usa
global.CSS = { supports: () => false }
global.ResizeObserver = class {
  observe () {}
  unobserve () {}
  disconnect () {}
}
