import type { Meta, StoryObj } from '@storybook/react-vite';
import Input from './Input';

const meta = {
  title: 'Componenti/Form/Input',
  component: Input,
  parameters: { layout: 'padded' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['boxed', 'underline'] },
    error: { control: 'boolean' },
  },
  args: { placeholder: 'La tua email', variant: 'boxed', error: false },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 380 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Boxed: Story = {};

export const Underline: Story = {
  args: { variant: 'underline', placeholder: 'Nome e cognome' },
};

export const Errore: Story = {
  args: { error: true, defaultValue: 'email-non-valida' },
};
