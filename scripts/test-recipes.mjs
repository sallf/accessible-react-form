/* global document, fetch, getComputedStyle, navigator, setTimeout, window */
import assert from 'node:assert/strict'
import { spawn, spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { createServer } from 'node:net'
import {
  copyFile,
  mkdtemp,
  readFile,
  writeFile,
  mkdir,
  rm,
} from 'node:fs/promises'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const site = join(root, 'site')
const recipe = join(site, 'src/recipes/contact')
const consumerTemplate = join(root, 'scripts/fixtures/consumer')
const fromSite = createRequire(join(site, 'package.json'))
const expectedInstall =
  'npm install accessible-react-form@next react-hook-form zod'
const children = new Set()
const work = await mkdtemp(join(tmpdir(), 'arform-recipe-test-'))
let browser

const freePort = () =>
  new Promise((resolvePort, reject) => {
    const server = createServer()
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port
      server.close(() => resolvePort(port))
    })
  })

const startServer = async (cwd, port) => {
  const bin = join(cwd, 'node_modules/.bin/vite')
  const child = spawn(
    bin,
    ['preview', '--host', '127.0.0.1', '--port', String(port), '--strictPort'],
    {
      cwd,
      stdio: ['ignore', 'pipe', 'pipe'],
    }
  )
  children.add(child)
  let output = ''
  child.stdout.on('data', (data) => {
    output += data
  })
  child.stderr.on('data', (data) => {
    output += data
  })
  const url = `http://127.0.0.1:${port}`
  for (let tries = 0; tries < 100; tries++) {
    if (child.exitCode !== null) throw new Error(`Vite exited: ${output}`)
    try {
      const response = await fetch(url)
      if (response.ok) return url
    } catch {
      /* server starting */
    }
    await new Promise((done) => setTimeout(done, 100))
  }
  throw new Error(`Vite did not start: ${output}`)
}

const command = (program, args, cwd, { quiet = false } = {}) => {
  const result = spawnSync(program, args, {
    cwd,
    encoding: 'utf8',
    timeout: 180_000,
  })
  if (!quiet || result.status !== 0) {
    process.stdout.write(result.stdout || '')
    process.stderr.write(result.stderr || '')
  }
  assert.equal(result.status, 0, `${program} ${args.join(' ')} failed`)
  return result.stdout
}

const availableChecks = []
let executedChecks = 0
const run = async (name, fn) => {
  availableChecks.push(name)
  if (process.env.RECIPES_TEST && process.env.RECIPES_TEST !== name) return
  executedChecks += 1
  process.stdout.write(`\n${name}\n`)
  await fn()
  process.stdout.write(`${name}: PASS\n`)
}

const sourceSelect = (page) => page.getByLabel('Source file')
const copySource = async (page, filename) => {
  await page.getByRole('tab', { name: 'Code' }).click()
  await sourceSelect(page).selectOption({ label: filename })
  await page.getByRole('button', { name: 'Copy to clipboard' }).click()
  return page.evaluate(() => navigator.clipboard.readText())
}

const preview = (page) => page.frameLocator('iframe[src*="contact-preview"]')

try {
  browser = await chromium.launch({ headless: true })
  const port = await freePort()
  const url = await startServer(site, port)
  const context = await browser.newContext({
    permissions: ['clipboard-read', 'clipboard-write'],
  })
  const page = await context.newPage()

  await run('RecipeDocsNavigation', async () => {
    await page.goto(`${url}/docs/quickstart`)
    await page.getByRole('link', { name: 'Contact form' }).first().click()
    await page.waitForURL('**/docs/recipes/contact')
    assert.match(await page.locator('main').innerText(), /Tailwind/i)
    await page.getByRole('tab', { name: 'Preview' }).click()
    await preview(page)
      .getByRole('textbox', { name: 'Your name' })
      .fill('Persisted name')
    await page.getByRole('tab', { name: 'Code' }).focus()
    await page.keyboard.press('Enter')
    assert.equal(
      await page
        .getByRole('tab', { name: 'Code' })
        .getAttribute('aria-selected'),
      'true'
    )
    await page.getByRole('tab', { name: 'Preview' }).focus()
    await page.keyboard.press('Enter')
    assert.equal(
      await preview(page)
        .getByRole('textbox', { name: 'Your name' })
        .inputValue(),
      'Persisted name'
    )
    await page.getByRole('tab', { name: 'Preview' }).focus()
    await page.keyboard.press('ArrowRight')
    assert.equal(
      await page
        .getByRole('tab', { name: 'Code' })
        .getAttribute('aria-selected'),
      'true'
    )
    await page.keyboard.press('ArrowLeft')
    assert.equal(
      await page
        .getByRole('tab', { name: 'Preview' })
        .getAttribute('aria-selected'),
      'true'
    )
    const panels = await page.getByRole('tab').evaluateAll((tabs) =>
      tabs.map((tab) => ({
        controls: tab.getAttribute('aria-controls'),
        selected: tab.getAttribute('aria-selected'),
      }))
    )
    assert.ok(panels.every(({ controls }) => controls))
    const relationships = await page.getByRole('tab').evaluateAll((tabs) =>
      tabs.every((tab) => {
        const controls = tab.getAttribute('aria-controls')
        return controls && document.getElementById(controls)
      })
    )
    assert.ok(relationships, 'Tabs refer to existing panels')
    assert.equal(panels.filter(({ selected }) => selected === 'true').length, 1)
    await page.getByRole('tab', { name: 'Code' }).click()
    await sourceSelect(page).focus()
    await sourceSelect(page).press('u')
    assert.equal(
      await sourceSelect(page).evaluate(
        (select) => select.selectedOptions[0].label
      ),
      'Usage.tsx'
    )

    const mobile = await browser.newContext({
      viewport: { width: 375, height: 812 },
    })
    const narrow = await mobile.newPage()
    await narrow.goto(`${url}/docs/recipes/contact`)
    await narrow.getByRole('tab', { name: 'Code' }).click()
    const overflow = await narrow.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth
    )
    assert.ok(overflow <= 1, `Page overflows by ${overflow}px at 375px`)
    assert.ok(await narrow.getByRole('tab', { name: 'Preview' }).isVisible())
    assert.ok(await narrow.getByRole('tab', { name: 'Code' }).isVisible())
    await mobile.close()
  })

  const copied = {}
  await run('RecipeCopyFiles', async () => {
    await page.goto(`${url}/docs/recipes/contact`)
    for (const filename of ['ContactForm.tsx', 'Usage.tsx']) {
      copied[filename] = await copySource(page, filename)
      const canonical = await readFile(join(recipe, filename), 'utf8')
      assert.equal(
        copied[filename],
        canonical,
        `${filename} copied text differs from canonical source`
      )
      const visibleCode = page
        .getByRole('tabpanel', { name: 'Code' })
        .locator('pre:visible code')
        .first()
      await visibleCode.waitFor()
      const rendered = await visibleCode.textContent()
      assert.equal(
        rendered,
        canonical,
        `${filename} displayed source differs from canonical source`
      )
      const alteredTail = await visibleCode.evaluate((element) => {
        const marker = document.createTextNode('/* altered tail */')
        element.append(marker)
        const text = element.textContent
        marker.remove()
        return text
      })
      assert.notEqual(
        alteredTail,
        canonical,
        'Full-source check missed an altered tail'
      )
      assert.match(canonical, /className/)
      assert.match(await page.getByRole('status').last().innerText(), /copied/i)
    }
    await page.getByRole('button', { name: 'Copy install command' }).click()
    assert.equal(
      await page.evaluate(() => navigator.clipboard.readText()),
      expectedInstall
    )
    const installStatus = page
      .getByText(expectedInstall, { exact: true })
      .locator('..')
      .getByRole('status')
    assert.match(await installStatus.innerText(), /copied/i)

    await page.evaluate(() => {
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: { writeText: () => Promise.reject(new Error('denied')) },
      })
    })
    await page.getByRole('button', { name: 'Copy to clipboard' }).click()
    assert.match(
      await page
        .getByRole('tabpanel', { name: 'Code' })
        .getByRole('status')
        .innerText(),
      /select.*copy|copy.*manually/i
    )
    const selectedSource = page
      .getByRole('tabpanel', { name: 'Code' })
      .locator('pre:visible code')
      .first()
    assert.match(await selectedSource.innerText(), /import .* from /)
    const selectable = await selectedSource.evaluate((element) => {
      for (let current = element; current; current = current.parentElement) {
        if (getComputedStyle(current).userSelect === 'none') return false
      }
      return true
    })
    assert.ok(selectable, 'Copy failure leaves source selectable')
  })

  await run('PackageAssets', async () => {
    command('npm', ['run', 'check:package-css'], root)
    const output = command('npm', ['pack', '--dry-run', '--json'], root, {
      quiet: true,
    })
    const files = JSON.parse(output)[0].files.map((file) => file.path)
    assert.ok(
      files.every(
        (file) =>
          !/(?:^|\/)(?:recipes|stories|storybook|site|playground)(?:\/|$)/i.test(
            file
          )
      ),
      'Package includes recipe or demo assets'
    )
  })

  await run('RecipeStyleIsolation', async () => {
    const theme = await readFile(
      fromSite.resolve('tailwindcss/theme.css'),
      'utf8'
    )
    const preflight = await readFile(
      fromSite.resolve('tailwindcss/preflight.css'),
      'utf8'
    )
    const vanillaTailwind = (
      await fromSite('tailwindcss').compile(
        `@layer theme {${theme}}\n@layer base {${preflight}}`
      )
    ).build([])
    await page.goto(`${url}/docs/recipes/contact`)
    await page.getByRole('tab', { name: 'Preview' }).click()
    const input = preview(page).getByRole('textbox', { name: 'Your name' })
    const before = await input.evaluate((element) => {
      const style = getComputedStyle(element)
      return {
        color: style.color,
        background: style.backgroundColor,
        border: style.borderColor,
        padding: style.padding,
      }
    })
    await page.addStyleTag({
      content:
        '.arform__input, input { color: rgb(255, 0, 0) !important; background: rgb(0, 255, 0) !important; border: 20px solid magenta !important; padding: 50px !important; }',
    })
    const after = await input.evaluate((element) => {
      const style = getComputedStyle(element)
      return {
        color: style.color,
        background: style.backgroundColor,
        border: style.borderColor,
        padding: style.padding,
      }
    })
    assert.deepEqual(after, before, 'Parent theme changed isolated preview')
    const plain = await preview(page)
      .locator('body')
      .evaluate((body) => {
        const form = document.createElement('form')
        const input = document.createElement('input')
        form.append(input)
        body.append(form)
        const style = getComputedStyle(input)
        const measured = {
          color: style.color,
          background: style.backgroundColor,
          border: style.borderColor,
          padding: style.padding,
        }
        form.remove()
        return measured
      })
    const clean = await page
      .locator('iframe[src*="contact-preview"]')
      .evaluate(async (_recipeFrame, reset) => {
        const control = document.createElement('iframe')
        control.srcdoc = `<style>${reset}</style><form><input id="ordinary"></form>`
        document.body.append(control)
        await new Promise((resolve) =>
          control.addEventListener('load', resolve, { once: true })
        )
        const style = getComputedStyle(
          control.contentDocument.getElementById('ordinary')
        )
        const measured = {
          color: style.color,
          background: style.backgroundColor,
          border: style.borderColor,
          padding: style.padding,
        }
        control.remove()
        return measured
      }, vanillaTailwind)
    assert.deepEqual(
      plain,
      clean,
      'Recipe CSS changed an adjacent ordinary form'
    )
    const leaked = await preview(page)
      .locator('body')
      .evaluate((body) => {
        const style = document.createElement('style')
        style.textContent = '@layer base { input { padding: 57px } }'
        const input = document.createElement('input')
        body.append(style, input)
        const padding = getComputedStyle(input).padding
        style.remove()
        input.remove()
        return padding
      })
    assert.notEqual(
      leaked,
      clean.padding,
      'Isolation check missed a deliberate @layer base leak'
    )
    assert.notDeepEqual(
      plain,
      after,
      'Ordinary input unexpectedly has recipe styling'
    )
  })

  await run('CopiedRecipeConsumer', async () => {
    if (!copied['ContactForm.tsx'] || !copied['Usage.tsx']) {
      await page.goto(`${url}/docs/recipes/contact`)
      for (const filename of ['ContactForm.tsx', 'Usage.tsx']) {
        copied[filename] = await copySource(page, filename)
      }
    }
    const fixture = join(work, 'consumer')
    await mkdir(join(fixture, 'src'), { recursive: true })
    await copyFile(
      join(consumerTemplate, 'package.json'),
      join(fixture, 'package.json')
    )
    const lock = JSON.parse(
      await readFile(join(consumerTemplate, 'package-lock.json'), 'utf8')
    )
    const tarball = command(
      'npm',
      ['pack', '--pack-destination', work, '--silent'],
      root,
      { quiet: true }
    )
      .trim()
      .split('\n')
      .at(-1)
    const packed = await readFile(join(work, tarball))
    await writeFile(join(fixture, 'accessible-react-form.tgz'), packed)
    const packageVersion = JSON.parse(
      await readFile(join(root, 'package.json'), 'utf8')
    ).version
    const lockedPackage = lock.packages['node_modules/accessible-react-form']
    assert.equal(
      lockedPackage.version,
      packageVersion,
      'Consumer lock needs a package-version update'
    )
    assert.equal(lockedPackage.resolved, 'file:accessible-react-form.tgz')
    lockedPackage.integrity = `sha512-${createHash('sha512').update(packed).digest('base64')}`
    await writeFile(
      join(fixture, 'package-lock.json'),
      `${JSON.stringify(lock, null, 2)}\n`
    )
    await writeFile(
      join(fixture, 'index.html'),
      '<div id="root"></div><script type="module" src="/src/main.tsx"></script>'
    )
    await writeFile(
      join(fixture, 'tsconfig.json'),
      JSON.stringify(
        {
          compilerOptions: {
            target: 'ES2022',
            lib: ['ES2022', 'DOM'],
            module: 'ESNext',
            moduleResolution: 'Bundler',
            jsx: 'react-jsx',
            strict: true,
            skipLibCheck: true,
            noEmit: true,
            allowSyntheticDefaultImports: true,
          },
          include: ['src', 'vite.config.ts'],
        },
        null,
        2
      )
    )
    await writeFile(
      join(fixture, 'vite.config.ts'),
      "import { defineConfig } from 'vite'\nimport react from '@vitejs/plugin-react'\nimport tailwind from '@tailwindcss/vite'\nexport default defineConfig({ plugins: [react(), tailwind()] })\n"
    )
    await writeFile(join(fixture, 'src/style.css'), "@import 'tailwindcss';\n")
    for (const [filename, contents] of Object.entries(copied))
      await writeFile(join(fixture, 'src', filename), contents)
    await writeFile(
      join(fixture, 'src/main.tsx'),
      `import React from 'react'\nimport { createRoot } from 'react-dom/client'\nimport { ARForm } from 'accessible-react-form'\nimport { z } from 'zod'\nimport Usage from './Usage'\nimport { ContactText } from './ContactForm'\nimport './style.css'\nconst schema = z.object({ reply: z.string().min(1) })\ncreateRoot(document.getElementById('root')!).render(<><Usage /><section><h2>Reusable field</h2><ARForm validationSchema={schema} onSubmit={(values) => { document.getElementById('wrapper-result')!.textContent = String(values.reply) }}><ContactText id="reply" label="Reply" required /><button type="submit">Save reply</button></ARForm><output id="wrapper-result" /></section></>)\n`
    )
    command(
      'npm',
      ['ci', '--ignore-scripts', '--no-audit', '--no-fund'],
      fixture
    )
    command('npm', ['run', 'build'], fixture)
    const consumerPort = await freePort()
    const consumerUrl = await startServer(fixture, consumerPort)
    const consumer = await browser.newPage()
    await consumer.goto(consumerUrl)
    await consumer.getByRole('textbox', { name: 'Your name' }).fill('Alex')
    await consumer
      .getByRole('textbox', { name: 'Email address' })
      .fill('alex@example.com')
    await consumer
      .getByRole('textbox', { name: 'Message' })
      .fill('Hello from the copied recipe')
    await consumer.getByRole('button', { name: 'Send message' }).click()
    await consumer.getByText('Thanks, Alex. Your message is ready.').waitFor()
    await consumer
      .getByRole('textbox', { name: 'Reply' })
      .fill('Reusable works')
    await consumer.getByRole('button', { name: 'Save reply' }).click()
    await consumer.getByText('Reusable works').waitFor()
    await consumer.close()
  })
  assert.ok(
    executedChecks > 0,
    `No recipe checks matched RECIPES_TEST=${JSON.stringify(process.env.RECIPES_TEST)}. Available checks: ${availableChecks.join(', ')}`
  )
} finally {
  await browser?.close()
  for (const child of children) child.kill('SIGTERM')
  await rm(work, { recursive: true, force: true })
}
