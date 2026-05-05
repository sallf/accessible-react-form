import { Link } from 'react-router-dom'

export const NotFound = () => {
  return (
    <>
      <h1>Not found</h1>
      <p>That docs page doesn't exist. Try the <Link to="/docs">introduction</Link>.</p>
    </>
  )
}
