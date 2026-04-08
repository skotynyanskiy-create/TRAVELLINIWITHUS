interface JsonLdProps {
  data: object;
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script type="application/ld+json">
      {JSON.stringify(data)}
    </script>
  );
}
