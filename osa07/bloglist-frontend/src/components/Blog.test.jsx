import { render, screen } from '@testing-library/react'
import BlogDetails from './BlogDetails.jsx'
import userEvent from '@testing-library/user-event'

const blog = {
  author: 'John Doe',
  title: 'John Deere blog',
  url: 'https://johndoee.com/',
  likes: 5,
  user: {
    name: 'Jormuli',
    username: 'jormuli',
    id: '68f4975761a7c2337e2cf8ba'
  },
  id: '68f7269113ecd182b2df32f4'
}

test('renders content', () => {
  render(
    <BlogDetails {...{
      blog,
      token: '',
      blogs: [],
      setBlogs: (blogs) => console.log(blogs)
    }} />
  )

  const element = screen.getByText('John Deere blog John Doe')
  expect(element).toBeDefined()
})

test('clicking the button shows blog details', async () => {
  render(<BlogDetails {...{
    blog,
    token: '',
    blogs: [],
    setBlogs: (blogs) => console.log(blogs),
    handleLike: (blog) => console.log(blog)
  }} />)


  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  screen.getByText('https://johndoee.com/', { exact: false })
  screen.getByText('likes: 5', { exact: false })
  screen.getByText('Jormuli', { exact: false })
})

test('clicking the like button twice calls event handler twice', async () => {
  const mockHandler = vi.fn()

  render(<BlogDetails {...{
    blog,
    token: '',
    blogs: [],
    setBlogs: (blogs) => console.log(blogs),
    handleLike: mockHandler
  }} />)


  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  await likeButton.click()
  await likeButton.click()

  expect(mockHandler.mock.calls).toHaveLength(2)
})
