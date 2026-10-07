module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/test_suite/' // Reemplaza con el nombre exacto de tu repo
    : '/'
}