import { describe, it, expect } from 'vitest';
import { render } from '../test/test-utils';
import Navbar from './Navbar';

describe('Navbar Component', () => {
  it('renders the logo', () => {
    const { getByText } = render(<Navbar />);
    expect(getByText(/Travellini/i)).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    const { getAllByText } = render(<Navbar />);
    expect(getAllByText(/Destinazioni/i).length).toBeGreaterThan(0);
    expect(getAllByText(/Esperienze/i).length).toBeGreaterThan(0);
    expect(getAllByText(/Shop/i).length).toBeGreaterThan(0);
  });
});
