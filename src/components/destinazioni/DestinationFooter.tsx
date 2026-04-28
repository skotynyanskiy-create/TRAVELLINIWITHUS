import CrossLinkWidget from '../CrossLinkWidget';
import Newsletter from '../Newsletter';
import Section from '../Section';

export default function DestinationFooter() {
  return (
    <>
      <Section className="!py-20">
        <CrossLinkWidget variant="to-guide" />
      </Section>

      <Section className="!py-0 !pb-16">
        <Newsletter variant="sand" />
      </Section>
    </>
  );
}
