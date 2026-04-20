import CrossLinkWidget from '../CrossLinkWidget';
import Newsletter from '../Newsletter';
import Section from '../Section';

export default function DestinationFooter() {
  return (
    <>
      <Section className="!py-20">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <CrossLinkWidget variant="to-esperienze" />
          <CrossLinkWidget variant="to-guide" />
        </div>
      </Section>

      <Section className="!py-0 !pb-16">
        <Newsletter variant="sand" />
      </Section>
    </>
  );
}
