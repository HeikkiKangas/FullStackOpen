import { render, screen } from '@testing-library/react'
import AddBlogForm from './AddBlogForm'
import userEvent from '@testing-library/user-event'

test('<AddBlogForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const addBlog = vi.fn()

  render(<AddBlogForm addBlog={addBlog} />)
  const viewButton = screen.getByText('Add blog')
  await user.click(viewButton)

  const inputs = screen.getAllByRole('textbox')
  const sendButton = screen.getByText('Create')

  await user.type(inputs[0], 'title')
  await user.type(inputs[1], 'author')
  await user.type(inputs[2], 'url')
  await user.click(sendButton)

  expect(addBlog.mock.calls).toHaveLength(1)
  expect(addBlog.mock.calls[0][0]).toBe('title')
  expect(addBlog.mock.calls[0][1]).toBe('author')
  expect(addBlog.mock.calls[0][2]).toBe('url')
})