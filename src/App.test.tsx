@"
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders main application heading', () => {
  render(<App />);
  expect(screen.getByText(/TrustRetail/i)).toBeInTheDocument();
});
"@ | Set-Content src\App.test.tsx
