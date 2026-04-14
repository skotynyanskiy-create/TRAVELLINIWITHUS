import Newsletter from './Newsletter';

interface InlineNewsletterBannerProps {
  source?: string;
}

export default function InlineNewsletterBanner({
  source = 'article_inline',
}: InlineNewsletterBannerProps) {
  return (
    <div className="my-12">
      <Newsletter variant="article" source={source} />
    </div>
  );
}
