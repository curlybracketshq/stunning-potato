import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders some content', () => {
  render(<App />);
  const element = screen.getByText(/Stunning Potato/i);
  expect(element).toBeInTheDocument();
});
