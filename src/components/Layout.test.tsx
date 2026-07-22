import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { render } from '../test/test-utils';
import Layout from './Layout';

describe('Layout Component', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/chi-siamo');
  });

  afterEach(() => {
    window.history.pushState({}, '', '/');
  });

  it('renders Navbar, Outlet, and Footer', () => {
    const { getAllByRole, getByRole } = render(<Layout />);

    expect(getAllByRole('link', { name: /Travellini/i }).length).toBeGreaterThanOrEqual(2);
    expect(getByRole('main')).toBeInTheDocument();
  });
});
