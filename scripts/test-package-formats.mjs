import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import {
  mkdtemp,
  mkdir,
  readFile,
  rm,
  symlink,
  writeFile,
} from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const fixture = await mkdtemp(path.join(tmpdir(), 'arform-package-formats-'))
const run = (command, args, cwd = fixture) => {
  const result = spawnSync(command, args, { cwd, encoding: 'utf8' })
  assert.equal(
    result.status,
    0,
    `${command} ${args.join(' ')}\n${result.stdout}\n${result.stderr}`
  )
  return result.stdout
}
try {
  // Exercise the published files, including the prepack build, rather than src aliases.
  await mkdir(path.join(root, 'dist'), { recursive: true })
  await writeFile(
    path.join(root, 'dist/index.es.js'),
    'export const stale = true;\n'
  )
  await writeFile(
    path.join(root, 'dist/index.js'),
    "throw new Error('Stale build was packed');\n"
  )
  const pack = JSON.parse(
    run('npm', ['pack', '--json', '--pack-destination', fixture], root)
  )[0]
  const modules = path.join(fixture, 'node_modules')
  const installed = path.join(modules, 'accessible-react-form')
  await mkdir(installed, { recursive: true })
  run('tar', [
    '-xzf',
    path.join(fixture, pack.filename),
    '--strip-components=1',
    '-C',
    installed,
  ])
  for (const name of [
    'react',
    'react-dom',
    'react-hook-form',
    '@types',
    '@standard-schema',
  ]) {
    await symlink(
      path.join(root, 'node_modules', name),
      path.join(modules, name),
      'dir'
    )
  }
  const render = `
const html = renderToStaticMarkup(React.createElement(ARForm, {onSubmit() {}},
  React.createElement(Text, {id: 'name', label: 'Name', required: true})));
assert.match(html, /<form/);
assert.match(html, /name="name"/);
assert.match(html, /aria-required="true"/);
console.log('Consumer rendered labeled required field');
`
  await writeFile(
    path.join(fixture, 'consumer.cjs'),
    `
const assert = require('node:assert/strict');
const React = require('react');
const {renderToStaticMarkup} = require('react-dom/server');
const {ARForm, Text} = require('accessible-react-form');
${render}`
  )
  await writeFile(
    path.join(fixture, 'consumer.mjs'),
    `
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {ARForm, Text} from 'accessible-react-form';
${render}`
  )
  for (const entry of ['consumer.cjs', 'consumer.mjs']) {
    run(process.execPath, ['--no-experimental-detect-module', entry])
    console.log(`PASS runtime ${entry} with syntax detection disabled`)
  }
  const typeConsumer = `
import * as React from 'react';
import {ARForm, Text, TagInput} from 'accessible-react-form';
const props: React.ComponentProps<typeof Text> = {id: 'name', label: 'Name'};
const form = React.createElement(ARForm, {
  onSubmit(values) { const value: unknown = values.name; void value; },
  children: React.createElement(Text, props)
});
const tags = React.createElement(TagInput, {id: 'tags', label: 'Tags', onlySuggestions: true});
void form; void tags;
// @ts-expect-error label is required
const missingLabel: React.ComponentProps<typeof Text> = {id: 'name'};
void missingLabel;
`
  const tsc = path.join(root, 'node_modules/typescript/bin/tsc')
  for (const [resolution, module, extensions] of [
    ['node16', 'Node16', ['cts', 'mts']],
    ['nodenext', 'NodeNext', ['cts', 'mts']],
    ['bundler', 'ESNext', ['mts']],
    ['node', 'CommonJS', ['ts']],
  ]) {
    for (const extension of extensions) {
      const filename = `types-${resolution}.${extension}`
      await writeFile(path.join(fixture, filename), typeConsumer)
      run(process.execPath, [
        tsc,
        '--noEmit',
        '--strict',
        '--esModuleInterop',
        '--types',
        'react',
        '--skipLibCheck',
        'false',
        '--lib',
        'es2020,dom',
        '--moduleResolution',
        resolution,
        '--module',
        module,
        filename,
      ])
      console.log(`PASS TypeScript ${resolution} ${extension}`)
    }
  }
  const files = pack.files.map(({ path: filename }) => filename)
  assert(
    !files.includes('dist/index.es.js'),
    'Obsolete ambiguous ESM entry leaked into tarball'
  )
  const manifest = JSON.parse(
    await readFile(path.join(installed, 'package.json'), 'utf8')
  )
  console.log(`PASS packed ${manifest.name}@${manifest.version}`)
} finally {
  await rm(fixture, { recursive: true, force: true })
}
