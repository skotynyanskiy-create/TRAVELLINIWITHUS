import { describe, it, expect } from 'vitest';
import { render, waitFor } from '../test/test-utils';
import Layout from './Layout';

describe('Layout Component', () => {
  it('renders Navbar, Outlet, and Footer', async () => {
    const { getAllByRole, getByRole } = render(<Layout />);

    await waitFor(() => {
      expect(getAllByRole('link', { name: /Travellini/i }).length).toBeGreaterThanOrEqual(2);
      expect(getByRole('main')).toBeInTheDocument();
    });
  });
});
