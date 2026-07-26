import { defineType, defineField } from 'sanity';

export const author = defineType({
  name: 'author',
  title: 'Autore',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nome',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Immagine di Profilo',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bio',
      title: 'Biografia',
      type: 'text',
      description: "Una breve descrizione dell'autore che apparirà in fondo ai post del blog.",
      validation: (Rule) => Rule.required(),
    }),
  ],
});
