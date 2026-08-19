import type { ReactNode } from 'react';
import VerifiedBox from '../editorial/VerifiedBox';
import type { DirectiveConfig, DirectiveNode } from './types';
import { markParagraphsBare } from './utils';

function toProps(directive: DirectiveNode): Record<string, unknown> {
  const props: Record<string, unknown> = {};
  const attrs = directive.attributes || {};
  if (attrs.visited) props['data-visited'] = attrs.visited;
  if (attrs.pricesChecked) props['data-prices-checked'] = attrs.pricesChecked;
  if (attrs.contacts) props['data-contacts'] = attrs.contacts;
  markParagraphsBare(directive.children || []);
  return props;
}

function VerifiedDirective({
  children,
  'data-visited': visited,
  'data-prices-checked': pricesChecked,
  'data-contacts': contacts,
}: {
  children?: ReactNode;
  'data-visited'?: string;
  'data-prices-checked'?: string;
  'data-contacts'?: string;
}) {
  return (
    <VerifiedBox visited={visited} pricesChecked={pricesChecked} contacts={contacts === 'true'}>
      {children}
    </VerifiedBox>
  );
}

export const verifiedDirective: DirectiveConfig = {
  name: 'verified',
  hName: 'verified-directive',
  toProps,
  component: VerifiedDirective,
};
