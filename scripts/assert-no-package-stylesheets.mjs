import { spawnSync } from 'node:child_process'

const packed = spawnSync('npm', ['pack', '--dry-run', '--json'], {
  encoding: 'utf8',
})

if (packed.status !== 0) {
  console.error(packed.stderr || packed.stdout)
  process.exit(packed.status || 1)
}

const files = JSON.parse(packed.stdout)[0].files.map((entry) => entry.path)
const stylesheets = files.filter((path) =>
  /\.(?:css|scss|sass|less)$/i.test(path)
)

if (stylesheets.length) {
  console.error(`Unexpected packaged stylesheets:\n${stylesheets.join('\n')}`)
  process.exit(1)
}

console.log(`No stylesheets in ${files.length} packaged files.`)
