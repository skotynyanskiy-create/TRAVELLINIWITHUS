import { describe, it, expect } from 'vitest';
import { render } from '../test/test-utils';
import Navbar from './Navbar';

describe('Navbar Component', () => {
  it('renders the logo', () => {
    const { getByText } = render(<Navbar />);
    expect(getByText(/Travellini/i)).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    const { getByText } = render(<Navbar />);
    expect(getByText(/Home/i)).toBeInTheDocument();
    expect(getByText(/Destinazioni/i)).toBeInTheDocument();
    expect(getByText(/Esperienze/i)).toBeInTheDocument();
  });
});
