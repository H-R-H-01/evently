import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LoadingSpinner } from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders the loading text appropriately', () => {
    render(<LoadingSpinner />);
    const preparingText = screen.getByText(/Preparing Event/i);
    expect(preparingText).toBeInTheDocument();
  });
});
