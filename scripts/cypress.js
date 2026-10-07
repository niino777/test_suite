// Ejecuta Cypress guardando su programa (binario) DENTRO del proyecto, en ./.cypress-cache,
// en vez de la carpeta AppData del usuario. Así evitamos los errores de ruta y de permisos.
//
// Uso (siempre a través de los scripts de package.json):
//   npm run cy:install   -> descarga el binario a .cypress-cache
//   npm run cy:verify    -> comprueba que quedó bien instalado
//   npm run cy:doctor    -> muestra un diagnóstico si algo falla
//   npm run test:e2e:run -> ejecuta las pruebas
const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')

const root = path.resolve(__dirname, '..')
const cacheDir = path.join(root, '.cypress-cache')
const version = require('cypress/package.json').version
const args = process.argv.slice(2)

// Variables que pueden haber quedado de intentos anteriores y apuntar a una ruta equivocada
const staleVars = ['CYPRESS_RUN_BINARY', 'CYPRESS_CACHE_FOLDER']
const oldValues = staleVars.filter((name) => process.env[name]).map((name) => `${name}=${process.env[name]}`)

process.env.CYPRESS_CACHE_FOLDER = cacheDir
delete process.env.CYPRESS_RUN_BINARY
// .npmrc evita que "npm install" descargue Cypress; aquí sí queremos descargarlo
Object.keys(process.env)
  .filter((name) => name.toLowerCase() === 'npm_config_cypress_install_binary')
  .forEach((name) => delete process.env[name])
if (args[0] === 'install' && process.env.CY_ZIP) {
  // Instalación sin internet: CY_ZIP apunta al archivo descargado a mano
  process.env.CYPRESS_INSTALL_BINARY = process.env.CY_ZIP
} else {
  delete process.env.CYPRESS_INSTALL_BINARY
}

const executable = () => {
  const base = path.join(cacheDir, version, 'Cypress')
  if (process.platform === 'win32') return path.join(base, 'Cypress.exe')
  if (process.platform === 'darwin') return path.join(base, 'Cypress.app', 'Contents', 'MacOS', 'Cypress')
  return path.join(base, 'Cypress')
}

const doctor = () => {
  const exe = executable()
  const problems = []
  if (/[^\x20-\x7e]/.test(root)) problems.push('La ruta del proyecto tiene tildes, "ñ" u otros caracteres especiales. Muévelo a una ruta simple, ej. C:\\proyectos\\modauno')
  if (/onedrive/i.test(root)) problems.push('El proyecto está dentro de OneDrive. Muévelo a una carpeta normal, ej. C:\\proyectos\\modauno')
  if (/\s/.test(root)) problems.push('La ruta del proyecto tiene espacios. Es mejor una ruta sin espacios')
  if (!fs.existsSync(exe)) problems.push('Falta el binario de Cypress. Ejecuta: npm run cy:install')

  console.log('--- Diagnóstico de Cypress ---')
  console.log('Sistema operativo :', process.platform, process.arch)
  console.log('Node              :', process.version)
  console.log('Cypress (paquete) :', version)
  console.log('Proyecto          :', root)
  console.log('Carpeta del binario:', cacheDir)
  console.log('Ejecutable esperado:', exe)
  console.log('¿Existe?          :', fs.existsSync(exe) ? 'SÍ' : 'NO')
  console.log('Variables antiguas:', oldValues.length ? oldValues.join(' | ') + '  (este proyecto las ignora)' : 'ninguna')
  console.log(problems.length ? '\nProblemas encontrados:\n- ' + problems.join('\n- ') : '\nTodo en orden. Prueba: npm run cy:verify')
}

if (args[0] === 'doctor') {
  doctor()
} else {
  const cli = path.join(path.dirname(require.resolve('cypress/package.json')), 'bin', 'cypress')
  const result = spawnSync(process.execPath, [cli, ...args], { stdio: 'inherit', env: process.env, cwd: root })
  if (result.status !== 0 && args[0] !== 'install') {
    console.log('\nSi el error menciona el binario, ejecuta: npm run cy:doctor')
  }
  process.exit(result.status === null ? 1 : result.status)
}
