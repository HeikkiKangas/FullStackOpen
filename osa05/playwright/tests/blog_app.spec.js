const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('BlogDetails app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {

    await page.getByRole('button', { name: 'Login' }).click()

    await expect(page.getByRole('textbox', { name: 'username' })).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'password' })).toBeVisible()
  })

  describe('Login', () => {
    test('Can login with correct credentials', async ({ page }) => {
      //await page.goto('http://localhost:5173')

      await page.getByRole('button', { name: 'Login' }).click()

      await page.getByRole('textbox', { name: 'username' }).fill('mluukkai')
      await page.getByRole('textbox', { name: 'password' }).fill('salainen')

      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('blogs')).toBeVisible()
    })

    test('Cannot login with incorrect credentials', async ({ page }) => {
      //await page.goto('http://localhost:5173')

      await page.getByRole('button', { name: 'Login' }).click()

      await page.getByRole('textbox', { name: 'username' }).fill('mluukkai')
      await page.getByRole('textbox', { name: 'password' }).fill('sala')

      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Invalid username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('button', { name: 'Login' }).click()

      await page.getByRole('textbox', { name: 'username' }).fill('mluukkai')
      await page.getByRole('textbox', { name: 'password' }).fill('salainen')

      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('blogs')).toBeVisible()
    })

    test('Add blog form is shown', async ({ page }) => {
      await page.getByRole('button', { name: 'Add blog' }).click()
      await expect(page.getByRole('textbox', { name: 'Title' })).toBeVisible()
      await expect(page.getByRole('textbox', { name: 'Author' })).toBeVisible()
      await expect(page.getByRole('textbox', { name: 'Url' })).toBeVisible()
    })

    test('Blogs can be added', async ({ page }) => {
      await page.getByRole('button', { name: 'Add blog' }).click()
      await page.getByRole('textbox', { name: 'Title' }).fill('Test blog')
      await page.getByRole('textbox', { name: 'Author' }).fill('Test blogger')
      await page.getByRole('textbox', { name: 'Url' }).fill('Test-url')
      await page.getByRole('button', { name: 'Create' }).click()
      await expect(page.getByText('Test blog Test blogger')).toBeVisible()
    })

    test('Blogs can be liked', async ({ page }) => {
      await page.getByRole('button', { name: 'Add blog' }).click()
      await page.getByRole('textbox', { name: 'Title' }).fill('Test blog')
      await page.getByRole('textbox', { name: 'Author' }).fill('Test blogger')
      await page.getByRole('textbox', { name: 'Url' }).fill('Test-url')
      await page.getByRole('button', { name: 'Create' }).click()

      await page.getByText('view').first().click()
      await expect(page.getByText('likes: 0')).toBeVisible()
      await page.getByText('like').click()
      await expect(page.getByText('likes: 1')).toBeVisible()
    })
  })
})
