import { describe, it, expect } from 'vitest';
import { render } from '../test/test-utils';
import Layout from './Layout';

describe('Layout Component', () => {
  it('renders Navbar, Outlet, and Footer', () => {
    const { getAllByRole, getByRole } = render(<Layout />);

    expect(getAllByRole('link', { name: /Travellini/i }).length).toBeGreaterThanOrEqual(2);
    expect(getByRole('main')).toBeInTheDocument();
  });
});
