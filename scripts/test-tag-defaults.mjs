/* global document, window */
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { build } from 'esbuild'
import { chromium } from 'playwright'

const root = fileURLToPath(new URL('../', import.meta.url))
const work = await mkdtemp(path.join(tmpdir(), 'arform-tag-defaults-'))
const run = (args, cwd) => {
  const result = spawnSync('npm', args, {
    cwd,
    encoding: 'utf8',
    timeout: 180_000,
  })
  assert.equal(
    result.status,
    0,
    `${args.join(' ')}\n${result.stdout}\n${result.stderr}`
  )
  return result.stdout
}
let browser
try {
  const pack = JSON.parse(
    run(['pack', '--json', '--pack-destination', work], root)
  )[0]
  const consumer = await readFile(
    path.join(root, 'scripts/fixtures/tag-defaults/consumer.mjs'),
    'utf8'
  )
  browser = await chromium.launch({ headless: true })
  // React 18 is essential: a React 19-only test misses the hidden input mismatch.
  for (const [react, rhf] of [
    ['18.3.1', '7.75.0'],
    ['18.3.1', '7.89.0'],
    ['19.2.5', '7.89.0'],
  ]) {
    const fixture = path.join(work, `react-${react}-rhf-${rhf}`)
    await mkdir(fixture)
    await writeFile(path.join(fixture, 'package.json'), '{"private":true}')
    run(
      [
        'install',
        '--ignore-scripts',
        '--no-audit',
        '--no-fund',
        path.join(work, pack.filename),
        `react@${react}`,
        `react-dom@${react}`,
        `react-hook-form@${rhf}`,
      ],
      fixture
    )
    await writeFile(path.join(fixture, 'consumer.mjs'), consumer)
    const bundled = await build({
      entryPoints: [path.join(fixture, 'consumer.mjs')],
      bundle: true,
      platform: 'browser',
      write: false,
      define: { 'process.env.NODE_ENV': '"production"' },
    })
    for (const onlySuggestions of [false, true]) {
      for (const explicitMethods of [false, true]) {
        for (const defaults of [
          { externalDefault: 'React', expected: 'React' },
          { componentDefault: 'React', expected: 'React' },
          {
            externalDefault: 'TypeScript',
            componentDefault: 'React',
            expected: 'TypeScript',
          },
          { externalDefault: '', componentDefault: 'React', expected: '' },
        ]) {
          const context = `React ${react} / RHF ${rhf}; ${JSON.stringify({ onlySuggestions, explicitMethods, ...defaults })}`
          const page = await browser.newPage()
          try {
            await page.setContent('<div id="root"></div>')
            await page.locator('body').evaluate(
              (body, options) => {
                body.dataset.options = JSON.stringify(options)
              },
              { onlySuggestions, explicitMethods, ...defaults }
            )
            await page.addScriptTag({ content: bundled.outputFiles[0].text })
            await page
              .locator('input[type=hidden]')
              .waitFor({ state: 'attached' })
            if (defaults.expected)
              await page
                .locator('.arform__tag-list')
                .waitFor({ state: 'visible' })
            const snapshot = () =>
              page.evaluate(() => ({
                stored: window.tagForm.getValues('topics'),
                hidden: document.querySelector('input[type="hidden"]').value,
                selected:
                  document.querySelector('.arform__tag-list')?.textContent ??
                  '',
              }))
            const before = await snapshot()
            assert.equal(before.stored, defaults.expected)
            assert.equal(before.hidden, defaults.expected)
            if (defaults.expected)
              assert(before.selected.includes(defaults.expected))
            else assert.equal(before.selected, '')
            assert.deepEqual(
              await page.evaluate(() => window.submitTags()),
              defaults.expected
                ? { values: { topics: defaults.expected } }
                : { error: 'required' }
            )
            await page.getByRole('button', { name: 'Reset empty' }).click()
            await page.waitForFunction(
              () => !document.querySelector('.arform__tag-list')
            )
            assert.deepEqual(await snapshot(), {
              stored: '',
              hidden: '',
              selected: '',
            })
            assert.deepEqual(await page.evaluate(() => window.submitTags()), {
              error: 'required',
            })
          } catch (error) {
            throw new Error(`Tag default case failed: ${context}`, {
              cause: error,
            })
          } finally {
            await page.close()
          }
        }
      }
    }
    console.log(
      `PASS React ${react} / RHF ${rhf}: both modes, inherited/explicit methods, defaults, precedence, reset-required`
    )
  }
} finally {
  await browser?.close()
  await rm(work, { recursive: true, force: true })
}
