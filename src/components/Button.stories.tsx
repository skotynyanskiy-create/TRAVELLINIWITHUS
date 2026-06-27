import type { Meta, StoryObj } from '@storybook/react-vite';
import Button from './Button';

const meta = {
  title: 'Componenti/Button',
  component: Button,
  parameters: { layout: 'centered' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'outline-light', 'cta'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
  },
  args: { children: 'Scopri le destinazioni', variant: 'primary', size: 'md' },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Cta: Story = {
  args: { variant: 'cta', children: 'Collabora con noi' },
};

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Tutti gli articoli' },
};

export const Outline: Story = {
  args: { variant: 'outline', children: 'Scarica il media kit' },
};

export const OutlineLightSuScuro: Story = {
  args: { variant: 'outline-light', children: 'Guarda i reel' },
  render: (args) => (
    <div style={{ background: 'var(--color-ink-deep)', padding: '2rem', borderRadius: 14 }}>
      <Button {...args} />
    </div>
  ),
};

export const Taglie: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </div>
  ),
};

export const Disabilitato: Story = {
  args: { disabled: true, children: 'Non disponibile' },
};
