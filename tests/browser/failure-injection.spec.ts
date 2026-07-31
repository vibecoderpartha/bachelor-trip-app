import { expect, test } from '@playwright/test'

const localBrowserHost = '127.0.0.1:4173'

test('IR-001 controlled browser failure retains a screenshot artifact', async ({ page }) => {
  test.skip(
    process.env.IR001_BROWSER_FAILURE_INJECTION !== 'enabled',
    'Controlled failure injection is disabled outside the evidence command.',
  )

  await page.route('**/*', async (route) => {
    if (new URL(route.request().url()).host === localBrowserHost) {
      await route.continue()
      return
    }

    await route.abort('blockedbyclient')
  })
  await page.goto('/', { waitUntil: 'domcontentloaded' })

  await expect(page.getByTestId('ir001-controlled-failure-sentinel')).toBeVisible()
})
