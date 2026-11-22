import { Link } from '@tanstack/react-router';

export function NotFoundPage() {
  return (
    <>
      <small>404</small>
      <h1>Page not found</h1>
      <Link to="/">Back to overview</Link>
    </>
  );
}
