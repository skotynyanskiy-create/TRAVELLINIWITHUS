import type { Meta, StoryObj } from '@storybook/react-vite';
import FormField from './FormField';
import Input from './Input';

const meta = {
  title: 'Componenti/Form/FormField',
  component: FormField,
  parameters: { layout: 'padded' },
  args: {
    label: 'Email',
    htmlFor: 'email',
    children: <Input id="email" type="email" placeholder="La tua email" />,
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 380 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: (args) => (
    <FormField {...args}>
      <Input id="email" type="email" placeholder="La tua email" />
    </FormField>
  ),
};

export const ConHint: Story = {
  args: { label: 'Nome', htmlFor: 'nome', hint: 'Come ti chiamiamo nella newsletter.' },
  render: (args) => (
    <FormField {...args}>
      <Input id="nome" placeholder="Rodrigo" />
    </FormField>
  ),
};

export const ConErrore: Story = {
  args: {
    label: 'Email',
    htmlFor: 'email-err',
    required: true,
    error: 'Inserisci un indirizzo email valido.',
  },
  render: (args) => (
    <FormField {...args}>
      <Input id="email-err" type="email" error defaultValue="non-valida" />
    </FormField>
  ),
};
