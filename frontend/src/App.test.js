import { render, screen } from '@testing-library/react';
import App from './App';

test('renders login form when not logged in', () => {
  render(<App />);
  const loginFormElement = screen.getByLabelText('Username');
  expect(loginFormElement).toBeInTheDocument();
});