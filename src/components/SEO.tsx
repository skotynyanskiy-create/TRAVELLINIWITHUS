import React from 'react';
import { Helmet } from 'react-helmet-async';
import { CONTACTS, SITE_URL } from '../config/site';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
}

const DEFAULT_SITE_NAME = 'Travelliniwithus';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.png`;

export default function SEO({
  title,
  description,
  canonical,
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  noindex = false,
}: SEOProps) {
  const finalTitle = title.toLowerCase().includes(DEFAULT_SITE_NAME.toLowerCase())
    ? title
    : `${title} | ${DEFAULT_SITE_NAME}`;

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'} />
      <meta name="theme-color" content="#f7f0e5" />
      <meta name="author" content={DEFAULT_SITE_NAME} />
      <meta property="og:site_name" content={DEFAULT_SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Travelliniwithus - posti particolari, esperienze reali e consigli di viaggio" />
      <meta property="og:locale" content="it_IT" />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content={CONTACTS.instagramHandle} />
      <meta name="twitter:creator" content={CONTACTS.instagramHandle} />
      {canonical && <link rel="canonical" href={canonical} />}
    </Helmet>
  );
}
