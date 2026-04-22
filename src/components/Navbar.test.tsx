import { describe, it, expect } from 'vitest';
import { render, waitFor } from '../test/test-utils';
import Navbar from './Navbar';

describe('Navbar Component', () => {
  it('renders the logo', async () => {
    const { getByText } = render(<Navbar />);
    await waitFor(() => {
      expect(getByText(/Travellini/i)).toBeInTheDocument();
    });
  });

  it('renders navigation links', async () => {
    const { getAllByText } = render(<Navbar />);
    await waitFor(() => {
      expect(getAllByText(/Destinazioni/i).length).toBeGreaterThan(0);
      expect(getAllByText(/Esperienze/i).length).toBeGreaterThan(0);
      expect(getAllByText(/Guide/i).length).toBeGreaterThan(0);
    });
  });
});
