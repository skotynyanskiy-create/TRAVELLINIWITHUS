interface JsonLdProps {
  data: object;
}

// Escape `<` so a stray `</script>` inside any string field cannot break the
// surrounding script tag, and so React does not HTML-entity-encode the JSON
// (which would invalidate it for crawlers like Google Rich Results Test).
function serialize(data: object) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serialize(data) }} />
  );
}
